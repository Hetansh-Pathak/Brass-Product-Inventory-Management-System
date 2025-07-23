const express = require('express');
const Joi = require('joi');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const productSchema = Joi.object({
  productName: Joi.string().required().max(100),
  description: Joi.string().max(500),
  category: Joi.string().valid('Rods', 'Sheets', 'Fittings', 'Pipes', 'Custom', 'Other').required(),
  hsnCode: Joi.string().required(),
  supplier: Joi.object({
    name: Joi.string().required(),
    contact: Joi.object({
      phone: Joi.string(),
      email: Joi.string().email(),
      address: Joi.string()
    })
  }).required(),
  specifications: Joi.object({
    dimensions: Joi.object({
      length: Joi.number(),
      width: Joi.number(),
      height: Joi.number(),
      diameter: Joi.number(),
      thickness: Joi.number(),
      unit: Joi.string().valid('mm', 'cm', 'inch', 'meter')
    }),
    weight: Joi.object({
      value: Joi.number(),
      unit: Joi.string().valid('kg', 'grams', 'tonnes')
    }),
    material: Joi.string(),
    grade: Joi.string(),
    finish: Joi.string()
  }),
  inventory: Joi.object({
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().valid('pieces', 'kg', 'meters', 'feet', 'sheets'),
    reorderLevel: Joi.number().min(0),
    maxStockLevel: Joi.number().min(0),
    location: Joi.object({
      warehouse: Joi.string(),
      section: Joi.string(),
      shelf: Joi.string()
    })
  }).required(),
  pricing: Joi.object({
    costPrice: Joi.number().min(0).required(),
    sellingPrice: Joi.number().min(0).required(),
    currency: Joi.string()
  }).required(),
  images: Joi.array().items(Joi.object({
    url: Joi.string(),
    alt: Joi.string(),
    isPrimary: Joi.boolean()
  })),
  status: Joi.string().valid('active', 'inactive', 'discontinued'),
  tags: Joi.array().items(Joi.string()),
  notes: Joi.string()
});

// @route   GET /api/products
// @desc    Get all products with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      category = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { productName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'supplier.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (status) query.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const products = await Product.find(query)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Product.countDocuments(query);

    // Get low stock products
    const lowStockCount = await Product.countDocuments({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    });

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      lowStockCount
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/low-stock
// @desc    Get products with low stock
// @access  Private
router.get('/low-stock', auth, async (req, res) => {
  try {
    const products = await Product.find({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    })
    .populate('createdBy', 'username email')
    .sort({ 'inventory.quantity': 1 });

    res.json(products);

  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({
      message: 'Error fetching low stock products',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get transaction history
    const transactions = await Transaction.getItemHistory(product._id, 'product', 10);

    res.json({
      product,
      transactions
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      message: 'Error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Create product
    const product = new Product({
      ...value,
      createdBy: req.user.userId
    });

    await product.save();

    // Create initial stock transaction
    const transaction = new Transaction({
      type: 'inward',
      category: 'product',
      item: {
        itemId: product._id,
        itemName: product.productName,
        itemCode: product.productCode,
        hsnCode: product.hsnCode
      },
      quantity: product.inventory.quantity,
      unit: product.inventory.unit,
      unitPrice: product.pricing.costPrice,
      balanceAfter: product.inventory.quantity,
      reason: 'purchase',
      notes: 'Initial stock entry',
      status: 'completed',
      createdBy: req.user.userId
    });

    await transaction.save();

    const populatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Product created successfully',
      product: populatedProduct
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      message: 'Error creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = productSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check for stock quantity changes
    const oldQuantity = product.inventory.quantity;
    const newQuantity = value.inventory.quantity;

    // Update product
    Object.assign(product, value);
    product.updatedBy = req.user.userId;
    await product.save();

    // Create transaction if quantity changed
    if (oldQuantity !== newQuantity) {
      const transaction = new Transaction({
        type: newQuantity > oldQuantity ? 'inward' : 'outward',
        category: 'product',
        item: {
          itemId: product._id,
          itemName: product.productName,
          itemCode: product.productCode,
          hsnCode: product.hsnCode
        },
        quantity: Math.abs(newQuantity - oldQuantity),
        unit: product.inventory.unit,
        unitPrice: product.pricing.costPrice,
        balanceAfter: newQuantity,
        reason: 'adjustment',
        notes: 'Stock adjustment via product update',
        status: 'completed',
        createdBy: req.user.userId
      });

      await transaction.save();
    }

    const updatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.json({
      message: 'Product updated successfully',
      product: updatedProduct
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      message: 'Error updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin/Manager)
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product has pending transactions or bills
    const hasTransactions = await Transaction.exists({
      'item.itemId': product._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (hasTransactions) {
      return res.status(400).json({
        message: 'Cannot delete product with pending transactions'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      message: 'Error deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/products/:id/stock
// @desc    Update product stock
// @access  Private
router.post('/:id/stock', auth, async (req, res) => {
  try {
    const { quantity, type, reason, notes, unitPrice } = req.body;

    if (!quantity || !type || !reason) {
      return res.status(400).json({
        message: 'Quantity, type, and reason are required'
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Calculate new quantity
    let newQuantity;
    if (type === 'inward') {
      newQuantity = product.inventory.quantity + quantity;
    } else if (type === 'outward') {
      newQuantity = product.inventory.quantity - quantity;
      if (newQuantity < 0) {
        return res.status(400).json({
          message: 'Insufficient stock quantity'
        });
      }
    } else {
      return res.status(400).json({
        message: 'Invalid transaction type'
      });
    }

    // Update product quantity
    product.inventory.quantity = newQuantity;
    await product.save();

    // Create transaction record
    const transaction = new Transaction({
      type,
      category: 'product',
      item: {
        itemId: product._id,
        itemName: product.productName,
        itemCode: product.productCode,
        hsnCode: product.hsnCode
      },
      quantity,
      unit: product.inventory.unit,
      unitPrice: unitPrice || product.pricing.costPrice,
      balanceAfter: newQuantity,
      reason,
      notes,
      status: 'completed',
      createdBy: req.user.userId
    });

    await transaction.save();

    const updatedProduct = await Product.findById(product._id)
      .populate('createdBy', 'username email');

    res.json({
      message: 'Stock updated successfully',
      product: updatedProduct,
      transaction
    });

  } catch (error) {
    console.error('Update stock error:', error);
    res.status(500).json({
      message: 'Error updating stock',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/products/stats/overview
// @desc    Get product statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ status: 'active' });
    const lowStockProducts = await Product.countDocuments({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    });
    const outOfStockProducts = await Product.countDocuments({
      'inventory.quantity': 0
    });
    
    const totalValue = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: null,
          totalCostValue: {
            $sum: {
              $multiply: ['$inventory.quantity', '$pricing.costPrice']
            }
          },
          totalSellingValue: {
            $sum: {
              $multiply: ['$inventory.quantity', '$pricing.sellingPrice']
            }
          }
        }
      }
    ]);

    const categoryStats = await Product.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalQuantity: { $sum: '$inventory.quantity' },
          totalValue: {
            $sum: {
              $multiply: ['$inventory.quantity', '$pricing.costPrice']
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalValue: totalValue[0] || { totalCostValue: 0, totalSellingValue: 0 },
      categoryStats
    });

  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      message: 'Error fetching product statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
