const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionNumber: {
    type: String,
    unique: true,
    required: true
  },
  type: {
    type: String,
    enum: ['inward', 'outward', 'adjustment', 'return', 'damage', 'transfer'],
    required: [true, 'Transaction type is required']
  },
  category: {
    type: String,
    enum: ['product', 'raw_material'],
    required: [true, 'Category is required']
  },
  item: {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'category'
    },
    itemName: {
      type: String,
      required: true
    },
    itemCode: String,
    hsnCode: String
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required']
  },
  unit: {
    type: String,
    required: true
  },
  unitPrice: {
    type: Number,
    default: 0
  },
  totalValue: {
    type: Number,
    default: 0
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  reference: {
    type: {
      type: String,
      enum: ['purchase_order', 'sales_order', 'bill', 'manual', 'production', 'quality_check']
    },
    number: String,
    id: mongoose.Schema.Types.ObjectId
  },
  party: {
    type: {
      type: String,
      enum: ['supplier', 'customer', 'internal']
    },
    name: String,
    contact: String
  },
  location: {
    from: {
      warehouse: String,
      section: String,
      shelf: String
    },
    to: {
      warehouse: String,
      section: String,
      shelf: String
    }
  },
  reason: {
    type: String,
    enum: ['purchase', 'sale', 'production', 'damage', 'expired', 'quality_issue', 'adjustment', 'return', 'transfer'],
    required: true
  },
  notes: String,
  documents: [{
    type: String, // receipt, invoice, etc.
    url: String,
    name: String
  }],
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvalDate: Date,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes
transactionSchema.index({ type: 1, createdAt: -1 });
transactionSchema.index({ 'item.itemId': 1, createdAt: -1 });
transactionSchema.index({ transactionNumber: 1 });
transactionSchema.index({ status: 1 });

// Pre-save middleware to generate transaction number
transactionSchema.pre('save', async function(next) {
  if (!this.transactionNumber && this.isNew) {
    const count = await mongoose.models.Transaction.countDocuments();
    const prefix = this.type === 'inward' ? 'IN' : this.type === 'outward' ? 'OUT' : 'TXN';
    this.transactionNumber = `${prefix}-${String(count + 1).padStart(8, '0')}`;
  }
  
  // Calculate total value
  this.totalValue = this.quantity * this.unitPrice;
  
  next();
});

// Static method to get stock balance for an item
transactionSchema.statics.getStockBalance = async function(itemId, category) {
  const lastTransaction = await this.findOne({
    'item.itemId': itemId,
    category: category,
    status: 'completed'
  }).sort({ createdAt: -1 });
  
  return lastTransaction ? lastTransaction.balanceAfter : 0;
};

// Static method to get transaction history for an item
transactionSchema.statics.getItemHistory = async function(itemId, category, limit = 50) {
  return this.find({
    'item.itemId': itemId,
    category: category
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('createdBy', 'username email')
  .populate('approvedBy', 'username email');
};

module.exports = mongoose.model('Transaction', transactionSchema);
