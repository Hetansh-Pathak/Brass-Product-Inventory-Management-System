const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  materialName: {
    type: String,
    required: [true, 'Material name is required'],
    trim: true,
    maxlength: [100, 'Material name cannot exceed 100 characters']
  },
  materialCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Material type is required'],
    enum: ['Brass Rod', 'Brass Sheet', 'Brass Tube', 'Brass Wire', 'Alloy', 'Other'],
    default: 'Other'
  },
  grade: {
    type: String,
    trim: true
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required'],
      trim: true
    },
    contact: {
      phone: String,
      email: String,
      address: String
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier'
    }
  },
  specifications: {
    purity: {
      type: Number,
      min: [0, 'Purity cannot be negative'],
      max: [100, 'Purity cannot exceed 100%']
    },
    composition: {
      copper: Number,
      zinc: Number,
      tin: Number,
      lead: Number,
      other: String
    },
    dimensions: {
      length: Number,
      width: Number,
      thickness: Number,
      diameter: Number,
      unit: {
        type: String,
        enum: ['mm', 'cm', 'inch', 'meter'],
        default: 'mm'
      }
    },
    weight: {
      value: Number,
      unit: {
        type: String,
        enum: ['kg', 'grams', 'tonnes'],
        default: 'kg'
      }
    }
  },
  inventory: {
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 0
    },
    unit: {
      type: String,
      enum: ['kg', 'pieces', 'meters', 'feet', 'tonnes'],
      default: 'kg'
    },
    reorderLevel: {
      type: Number,
      default: 50
    },
    maxStockLevel: {
      type: Number,
      default: 1000
    },
    location: {
      warehouse: String,
      section: String,
      shelf: String
    }
  },
  pricing: {
    costPrice: {
      type: Number,
      required: [true, 'Cost price is required'],
      min: [0, 'Cost price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    priceHistory: [{
      price: Number,
      date: {
        type: Date,
        default: Date.now
      },
      reason: String
    }]
  },
  qualityChecks: [{
    parameter: String,
    value: String,
    unit: String,
    status: {
      type: String,
      enum: ['pass', 'fail', 'pending'],
      default: 'pending'
    },
    checkedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  certifications: [{
    name: String,
    number: String,
    issuedBy: String,
    issueDate: Date,
    expiryDate: Date,
    documentUrl: String
  }],
  status: {
    type: String,
    enum: ['available', 'low-stock', 'out-of-stock', 'on-order'],
    default: 'available'
  },
  notes: String,
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
rawMaterialSchema.index({ materialName: 'text' });
rawMaterialSchema.index({ type: 1, status: 1 });
rawMaterialSchema.index({ 'supplier.name': 1 });

// Pre-save middleware to generate material code
rawMaterialSchema.pre('save', async function(next) {
  if (!this.materialCode && this.isNew) {
    const count = await mongoose.models.RawMaterial.countDocuments();
    this.materialCode = `RM${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Update status based on inventory
rawMaterialSchema.pre('save', function(next) {
  if (this.inventory.quantity === 0) {
    this.status = 'out-of-stock';
  } else if (this.inventory.quantity <= this.inventory.reorderLevel) {
    this.status = 'low-stock';
  } else {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
