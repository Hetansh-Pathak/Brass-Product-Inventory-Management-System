const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  productCode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Rods', 'Sheets', 'Fittings', 'Pipes', 'Custom', 'Other'],
    default: 'Other'
  },
  hsnCode: {
    type: String,
    required: [true, 'HSN code is required'],
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
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      diameter: Number,
      thickness: Number,
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
    },
    material: {
      type: String,
      default: 'Brass'
    },
    grade: String,
    finish: String
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
      enum: ['pieces', 'kg', 'meters', 'feet', 'sheets'],
      default: 'pieces'
    },
    reorderLevel: {
      type: Number,
      default: 10
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
    sellingPrice: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Selling price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    },
    priceHistory: [{
      price: Number,
      type: {
        type: String,
        enum: ['cost', 'selling']
      },
      date: {
        type: Date,
        default: Date.now
      },
      reason: String
    }]
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['active', 'inactive', 'discontinued'],
    default: 'active'
  },
  tags: [String],
  notes: String,
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

// Indexes for better performance
productSchema.index({ productName: 'text', description: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'supplier.name': 1 });
productSchema.index({ hsnCode: 1 });

// Virtual for calculating profit margin
productSchema.virtual('profitMargin').get(function() {
  if (this.pricing.costPrice && this.pricing.sellingPrice) {
    return ((this.pricing.sellingPrice - this.pricing.costPrice) / this.pricing.costPrice * 100).toFixed(2);
  }
  return 0;
});

// Pre-save middleware to generate product code
productSchema.pre('save', async function(next) {
  if (!this.productCode && this.isNew) {
    const count = await mongoose.models.Product.countDocuments();
    this.productCode = `BR${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);
