const mongoose = require('mongoose');

const inventoryLedgerSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['IN', 'OUT', 'ADJUST'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    enum: ['Purchase', 'Invoice', 'Adjustment', 'Damaged', 'Return'],
    required: true
  },
  referenceId: String,
  referenceType: {
    type: String,
    enum: ['Purchase', 'Invoice', 'Manual']
  },
  rate: Number,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('InventoryLedger', inventoryLedgerSchema);
