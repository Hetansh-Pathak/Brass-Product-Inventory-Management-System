const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    unique: true,
    required: true
  },
  orderNumber: {
    type: String,
    trim: true
  },
  customer: {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    email: {
      type: String,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    gstNumber: {
      type: String,
      trim: true
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer'
    }
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    productName: {
      type: String,
      required: true
    },
    hsnCode: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.01, 'Quantity must be greater than 0']
    },
    unit: {
      type: String,
      default: 'pieces'
    },
    unitPrice: {
      type: Number,
      required: [true, 'Unit price is required'],
      min: [0, 'Unit price cannot be negative']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%']
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    taxRate: {
      type: Number,
      default: 18 // GST rate
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    subtotal: {
      type: Number,
      required: true
    },
    total: {
      type: Number,
      required: true
    }
  }],
  totals: {
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    totalDiscount: {
      type: Number,
      default: 0
    },
    totalTax: {
      type: Number,
      default: 0
    },
    grandTotal: {
      type: Number,
      required: true
    },
    roundOff: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      required: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: ['cash', 'card', 'bank_transfer', 'cheque', 'upi', 'partial'],
      default: 'cash'
    },
    status: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'overdue'],
      default: 'pending'
    },
    dueDate: {
      type: Date
    },
    paidAmount: {
      type: Number,
      default: 0
    },
    remainingAmount: {
      type: Number,
      default: 0
    },
    transactions: [{
      amount: Number,
      method: String,
      reference: String,
      date: {
        type: Date,
        default: Date.now
      },
      notes: String
    }]
  },
  delivery: {
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    method: {
      type: String,
      enum: ['pickup', 'delivery', 'courier'],
      default: 'pickup'
    },
    date: Date,
    charges: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['pending', 'dispatched', 'delivered'],
      default: 'pending'
    },
    trackingNumber: String
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'cancelled', 'refunded'],
    default: 'draft'
  },
  notes: String,
  terms: String,
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringDetails: {
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'quarterly', 'yearly']
    },
    nextDate: Date,
    endDate: Date
  },
  documents: [{
    type: {
      type: String,
      enum: ['invoice', 'receipt', 'delivery_note']
    },
    url: String,
    generatedAt: {
      type: Date,
      default: Date.now
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
billSchema.index({ billNumber: 1 });
billSchema.index({ 'customer.name': 1 });
billSchema.index({ status: 1 });
billSchema.index({ 'payment.status': 1 });
billSchema.index({ createdAt: -1 });

// Pre-save middleware to generate bill number
billSchema.pre('save', async function(next) {
  if (!this.billNumber && this.isNew) {
    const count = await mongoose.models.Bill.countDocuments();
    const year = new Date().getFullYear();
    this.billNumber = `INV-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate totals
billSchema.pre('save', function(next) {
  // Calculate item totals
  this.items.forEach(item => {
    const subtotal = item.quantity * item.unitPrice;
    const discountAmount = (subtotal * item.discount) / 100;
    const discountedAmount = subtotal - discountAmount;
    const taxAmount = (discountedAmount * item.taxRate) / 100;
    
    item.discountAmount = discountAmount;
    item.subtotal = subtotal;
    item.taxAmount = taxAmount;
    item.total = discountedAmount + taxAmount;
  });

  // Calculate bill totals
  this.totals.subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.totals.totalDiscount = this.items.reduce((sum, item) => sum + item.discountAmount, 0);
  this.totals.totalTax = this.items.reduce((sum, item) => sum + item.taxAmount, 0);
  this.totals.grandTotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  // Add delivery charges
  this.totals.grandTotal += this.delivery.charges || 0;
  
  // Round off to nearest whole number
  this.totals.roundOff = Math.round(this.totals.grandTotal) - this.totals.grandTotal;
  this.totals.finalAmount = Math.round(this.totals.grandTotal);
  
  // Calculate remaining amount
  this.payment.remainingAmount = this.totals.finalAmount - this.payment.paidAmount;
  
  next();
});

module.exports = mongoose.model('Bill', billSchema);
