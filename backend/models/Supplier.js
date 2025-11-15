const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  gstin: String,
  bankName: String,
  accountNo: String,
  ifsc: String,
  outstandingBalance: {
    type: Number,
    default: 0
  },
  totalPurchases: {
    type: Number,
    default: 0
  },
  paymentTerms: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Supplier', supplierSchema);
