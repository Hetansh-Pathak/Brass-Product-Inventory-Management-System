const express = require('express');
const Joi = require('joi');
const RawMaterial = require('../models/RawMaterial');
const Transaction = require('../models/Transaction');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Validation schema
const materialSchema = Joi.object({
  materialName: Joi.string().required().max(100),
  type: Joi.string().valid('Brass Rod', 'Brass Sheet', 'Brass Tube', 'Brass Wire', 'Alloy', 'Other').required(),
  grade: Joi.string(),
  supplier: Joi.object({
    name: Joi.string().required(),
    contact: Joi.object({
      phone: Joi.string(),
      email: Joi.string().email(),
      address: Joi.string()
    })
  }).required(),
  specifications: Joi.object({
    purity: Joi.number().min(0).max(100),
    composition: Joi.object({
      copper: Joi.number(),
      zinc: Joi.number(),
      tin: Joi.number(),
      lead: Joi.number(),
      other: Joi.string()
    }),
    dimensions: Joi.object({
      length: Joi.number(),
      width: Joi.number(),
      thickness: Joi.number(),
      diameter: Joi.number(),
      unit: Joi.string().valid('mm', 'cm', 'inch', 'meter')
    }),
    weight: Joi.object({
      value: Joi.number(),
      unit: Joi.string().valid('kg', 'grams', 'tonnes')
    })
  }),
  inventory: Joi.object({
    quantity: Joi.number().min(0).required(),
    unit: Joi.string().valid('kg', 'pieces', 'meters', 'feet', 'tonnes'),
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
    currency: Joi.string()
  }).required(),
  notes: Joi.string(),
  images: Joi.array().items(Joi.object({
    url: Joi.string(),
    alt: Joi.string(),
    isPrimary: Joi.boolean()
  }))
});

// @route   GET /api/materials
// @desc    Get all raw materials with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      type = '',
      status = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    
    if (search) {
      query.$or = [
        { materialName: { $regex: search, $options: 'i' } },
        { type: { $regex: search, $options: 'i' } },
        { 'supplier.name': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (type) query.type = type;
    if (status) query.status = status;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const materials = await RawMaterial.find(query)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await RawMaterial.countDocuments(query);

    // Get low stock materials
    const lowStockCount = await RawMaterial.countDocuments({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    });

    res.json({
      materials,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
      lowStockCount
    });

  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({
      message: 'Error fetching raw materials',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/materials/low-stock
// @desc    Get materials with low stock
// @access  Private
router.get('/low-stock', auth, async (req, res) => {
  try {
    const materials = await RawMaterial.find({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    })
    .populate('createdBy', 'username email')
    .sort({ 'inventory.quantity': 1 });

    res.json(materials);

  } catch (error) {
    console.error('Get low stock materials error:', error);
    res.status(500).json({
      message: 'Error fetching low stock materials',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/materials/:id
// @desc    Get single material
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    if (!material) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    // Get transaction history
    const transactions = await Transaction.getItemHistory(material._id, 'raw_material', 10);

    res.json({
      material,
      transactions
    });

  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({
      message: 'Error fetching raw material',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/materials
// @desc    Create new raw material
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = materialSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    // Create material
    const material = new RawMaterial({
      ...value,
      createdBy: req.user.userId
    });

    await material.save();

    // Create initial stock transaction
    const transaction = new Transaction({
      type: 'inward',
      category: 'raw_material',
      item: {
        itemId: material._id,
        itemName: material.materialName,
        itemCode: material.materialCode
      },
      quantity: material.inventory.quantity,
      unit: material.inventory.unit,
      unitPrice: material.pricing.costPrice,
      balanceAfter: material.inventory.quantity,
      reason: 'purchase',
      notes: 'Initial stock entry',
      status: 'completed',
      createdBy: req.user.userId
    });

    await transaction.save();

    const populatedMaterial = await RawMaterial.findById(material._id)
      .populate('createdBy', 'username email');

    res.status(201).json({
      message: 'Raw material created successfully',
      material: populatedMaterial
    });

  } catch (error) {
    console.error('Create material error:', error);
    res.status(500).json({
      message: 'Error creating raw material',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   PUT /api/materials/:id
// @desc    Update raw material
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate input
    const { error, value } = materialSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }

    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    // Check for stock quantity changes
    const oldQuantity = material.inventory.quantity;
    const newQuantity = value.inventory.quantity;

    // Update material
    Object.assign(material, value);
    material.updatedBy = req.user.userId;
    await material.save();

    // Create transaction if quantity changed
    if (oldQuantity !== newQuantity) {
      const transaction = new Transaction({
        type: newQuantity > oldQuantity ? 'inward' : 'outward',
        category: 'raw_material',
        item: {
          itemId: material._id,
          itemName: material.materialName,
          itemCode: material.materialCode
        },
        quantity: Math.abs(newQuantity - oldQuantity),
        unit: material.inventory.unit,
        unitPrice: material.pricing.costPrice,
        balanceAfter: newQuantity,
        reason: 'adjustment',
        notes: 'Stock adjustment via material update',
        status: 'completed',
        createdBy: req.user.userId
      });

      await transaction.save();
    }

    const updatedMaterial = await RawMaterial.findById(material._id)
      .populate('createdBy', 'username email')
      .populate('updatedBy', 'username email');

    res.json({
      message: 'Raw material updated successfully',
      material: updatedMaterial
    });

  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({
      message: 'Error updating raw material',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   DELETE /api/materials/:id
// @desc    Delete raw material
// @access  Private (Admin/Manager)
router.delete('/:id', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    // Check if material has pending transactions
    const hasTransactions = await Transaction.exists({
      'item.itemId': material._id,
      status: { $in: ['pending', 'approved'] }
    });

    if (hasTransactions) {
      return res.status(400).json({
        message: 'Cannot delete raw material with pending transactions'
      });
    }

    await RawMaterial.findByIdAndDelete(req.params.id);

    res.json({
      message: 'Raw material deleted successfully'
    });

  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({
      message: 'Error deleting raw material',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   POST /api/materials/:id/stock
// @desc    Update material stock
// @access  Private
router.post('/:id/stock', auth, async (req, res) => {
  try {
    const { quantity, type, reason, notes, unitPrice } = req.body;

    if (!quantity || !type || !reason) {
      return res.status(400).json({
        message: 'Quantity, type, and reason are required'
      });
    }

    const material = await RawMaterial.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ message: 'Raw material not found' });
    }

    // Calculate new quantity
    let newQuantity;
    if (type === 'inward') {
      newQuantity = material.inventory.quantity + quantity;
    } else if (type === 'outward') {
      newQuantity = material.inventory.quantity - quantity;
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

    // Update material quantity
    material.inventory.quantity = newQuantity;
    await material.save();

    // Create transaction record
    const transaction = new Transaction({
      type,
      category: 'raw_material',
      item: {
        itemId: material._id,
        itemName: material.materialName,
        itemCode: material.materialCode
      },
      quantity,
      unit: material.inventory.unit,
      unitPrice: unitPrice || material.pricing.costPrice,
      balanceAfter: newQuantity,
      reason,
      notes,
      status: 'completed',
      createdBy: req.user.userId
    });

    await transaction.save();

    const updatedMaterial = await RawMaterial.findById(material._id)
      .populate('createdBy', 'username email');

    res.json({
      message: 'Stock updated successfully',
      material: updatedMaterial,
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

// @route   GET /api/materials/stats/overview
// @desc    Get raw material statistics
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const totalMaterials = await RawMaterial.countDocuments({ status: 'available' });
    const lowStockMaterials = await RawMaterial.countDocuments({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    });
    const outOfStockMaterials = await RawMaterial.countDocuments({
      'inventory.quantity': 0
    });
    
    const totalValue = await RawMaterial.aggregate([
      { $match: { status: { $ne: 'out-of-stock' } } },
      {
        $group: {
          _id: null,
          totalValue: {
            $sum: {
              $multiply: ['$inventory.quantity', '$pricing.costPrice']
            }
          }
        }
      }
    ]);

    const typeStats = await RawMaterial.aggregate([
      { $match: { status: { $ne: 'out-of-stock' } } },
      {
        $group: {
          _id: '$type',
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
      totalMaterials,
      lowStockMaterials,
      outOfStockMaterials,
      totalValue: totalValue[0]?.totalValue || 0,
      typeStats
    });

  } catch (error) {
    console.error('Get material stats error:', error);
    res.status(500).json({
      message: 'Error fetching raw material statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
