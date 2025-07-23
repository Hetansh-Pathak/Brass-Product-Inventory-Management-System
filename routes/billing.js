const express = require('express');
const Joi = require('joi');
const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const billItemSchema = Joi.object({
  product: Joi.string().required(),
  quantity: Joi.number().min(0.01).required(),
  unit: Joi.string(),
  unitPrice: Joi.number().min(0).required(),
  discount: Joi.number().min(0).max(100).default(0),
  taxRate: Joi.number().min(0).default(18)
});

const billSchema = Joi.object({
  orderNumber: Joi.string(),
  customer: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email(),
    phone: Joi.string(),
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.string()
    }),
    gstNumber: Joi.string()
  }).required(),
  items: Joi.array().items(billItemSchema).min(1).required(),
  delivery: Joi.object({
    address: Joi.object({
      street: Joi.string(),
      city: Joi.string(),
      state: Joi.string(),
      country: Joi.string(),
      postalCode: Joi.string()
    }),
    method: Joi.string().valid('pickup', 'delivery', 'courier'),
    date: Joi.date(),
    charges: Joi.number().min(0).default(0)
  }),
  notes: Joi.string(),
  terms: Joi.string(),
  payment: Joi.object({
    method: Joi.string().valid('cash', 'card', 'bank_transfer', 'cheque', 'upi', 'partial'),
    dueDate: Joi.date()
  })
});

// @route   GET /api/billing
// @desc    Get all bills with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      paymentStatus = '',
      startDate = '',
      endDate = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { billNumber: { $regex: search, $options: 'i' } },
        { 'customer.name': { $regex: search, $options: 'i' } },
        { 'customer.email': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (status) query.status = status;
    if (paymentStatus) query['payment.status'] = paymentStatus;
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const bills = await Bill.find(query)
      .populate('items.product', 'productName category')
      .populate('createdBy', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Bill.countDocuments(query);

    // Get summary statistics
    const stats = await Bill.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' },
          totalPending: { $sum: '$payment.remainingAmount' }
        }
      }
    ]);

    res.json({
      bills,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      stats: stats[0] || { totalAmount: 0, totalPaid: 0, totalPending: 0 }
    });

  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({
      message: 'Error fetching bills',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/billing/:id
// @desc    Get single bill
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('items.product', 'productName category hsnCode specifications')
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    res.json(bill);

  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({
      message: 'Error fetching bill',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/billing
// @desc    Create new bill
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = billSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Validate and populate product details
    const populatedItems = [];
    for (const item of value.items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({
          message: `Product not found: ${item.product}`
        });
      }

      // Check stock availability
      if (product.inventory.quantity < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.productName}. Available: ${product.inventory.quantity}, Requested: ${item.quantity}`
        });
      }

      populatedItems.push({
        product: product._id,
        productName: product.productName,
        hsnCode: product.hsnCode,
        quantity: item.quantity,
        unit: item.unit || product.inventory.unit,
        unitPrice: item.unitPrice,
        discount: item.discount || 0,
        taxRate: item.taxRate || 18
      });
    }

    // Create bill
    const bill = new Bill({
      ...value,
      items: populatedItems,
      createdBy: req.user.userId
    });

    await bill.save();

    // Update product inventory and create transactions
    for (let i = 0; i < populatedItems.length; i++) {
      const item = populatedItems[i];
      const product = await Product.findById(item.product);
      
      // Update product quantity
      product.inventory.quantity -= item.quantity;
      await product.save();

      // Create outward transaction
      const transaction = new Transaction({
        type: 'outward',
        category: 'product',
        item: {
          itemId: product._id,
          itemName: product.productName,
          itemCode: product.productCode,
          hsnCode: product.hsnCode
        },
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: item.unitPrice,
        balanceAfter: product.inventory.quantity,
        reference: {
          type: 'bill',
          number: bill.billNumber,
          id: bill._id
        },
        party: {
          type: 'customer',
          name: bill.customer.name,
          contact: bill.customer.phone
        },
        reason: 'sale',
        notes: `Sale to ${bill.customer.name}`,
        status: 'completed',
        createdBy: req.user.userId
      });

      await transaction.save();
    }

    const populatedBill = await Bill.findById(bill._id)
      .populate('items.product', 'productName category')
      .populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Bill created successfully',
      bill: populatedBill
    });

  } catch (error) {
    console.error('Create bill error:', error);
    res.status(500).json({
      message: 'Error creating bill',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/billing/:id
// @desc    Update bill
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Only allow updates if bill is in draft status
    if (bill.status !== 'draft') {
      return res.status(400).json({
        message: 'Only draft bills can be updated'
      });
    }

    // Validate input
    const { error, value } = billSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Update bill
    Object.assign(bill, value);
    bill.updatedBy = req.user.userId;
    await bill.save();

    const updatedBill = await Bill.findById(bill._id)
      .populate('items.product', 'productName category')
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.json({
      message: 'Bill updated successfully',
      bill: updatedBill
    });

  } catch (error) {
    console.error('Update bill error:', error);
    res.status(500).json({
      message: 'Error updating bill',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/billing/:id/status
// @desc    Update bill status
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['draft', 'sent', 'paid', 'cancelled', 'refunded'].includes(status)) {
      return res.status(400).json({
        message: 'Invalid status'
      });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    bill.status = status;
    bill.updatedBy = req.user.userId;
    await bill.save();

    res.json({
      message: 'Bill status updated successfully',
      bill
    });

  } catch (error) {
    console.error('Update bill status error:', error);
    res.status(500).json({
      message: 'Error updating bill status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/billing/:id/payment
// @desc    Record payment for bill
// @access  Private
router.post('/:id/payment', auth, async (req, res) => {
  try {
    const { amount, method, reference, notes } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        message: 'Valid payment amount is required'
      });
    }

    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Check if payment amount is valid
    if (bill.payment.paidAmount + amount > bill.totals.finalAmount) {
      return res.status(400).json({
        message: 'Payment amount exceeds remaining balance'
      });
    }

    // Add payment transaction
    bill.payment.transactions.push({
      amount,
      method: method || 'cash',
      reference,
      notes,
      date: new Date()
    });

    // Update payment amounts
    bill.payment.paidAmount += amount;
    bill.payment.remainingAmount = bill.totals.finalAmount - bill.payment.paidAmount;

    // Update payment status
    if (bill.payment.remainingAmount === 0) {
      bill.payment.status = 'paid';
      bill.status = 'paid';
    } else if (bill.payment.paidAmount > 0) {
      bill.payment.status = 'partial';
    }

    bill.updatedBy = req.user.userId;
    await bill.save();

    res.json({
      message: 'Payment recorded successfully',
      bill
    });

  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({
      message: 'Error recording payment',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/billing/:id
// @desc    Delete bill
// @access  Private (Admin/Manager)
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) {
      return res.status(404).json({ message: 'Bill not found' });
    }

    // Only allow deletion of draft bills
    if (bill.status !== 'draft') {
      return res.status(400).json({
        message: 'Only draft bills can be deleted'
      });
    }

    await Bill.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Bill deleted successfully'
    });

  } catch (error) {
    console.error('Delete bill error:', error);
    res.status(500).json({
      message: 'Error deleting bill',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/billing/stats/overview
// @desc    Get billing statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    const stats = await Bill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalRevenue: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' },
          totalPending: { $sum: '$payment.remainingAmount' },
          averageBillValue: { $avg: '$totals.finalAmount' }
        }
      }
    ]);

    const statusStats = await Bill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totals.finalAmount' }
        }
      }
    ]);

    const paymentStats = await Bill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$payment.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totals.finalAmount' }
        }
      }
    ]);

    const monthlyStats = await Bill.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalBills: { $sum: 1 },
          totalRevenue: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    res.json({
      overview: stats[0] || {
        totalBills: 0,
        totalRevenue: 0,
        totalPaid: 0,
        totalPending: 0,
        averageBillValue: 0
      },
      statusStats,
      paymentStats,
      monthlyStats
    });

  } catch (error) {
    console.error('Get billing stats error:', error);
    res.status(500).json({
      message: 'Error fetching billing statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
