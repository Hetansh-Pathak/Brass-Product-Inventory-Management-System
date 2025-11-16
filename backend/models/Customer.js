const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
  outstandingBalance: {
    type: Number,
    default: 0
  },
  totalInvoices: {
    type: Number,
    default: 0
  },
  totalSales: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Customer', customerSchema);
