const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceNo: {
    type: String,
    required: true,
    unique: true
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  invoiceType: {
    type: String,
    enum: ['Tax Invoice', 'Estimate', 'Delivery Challan', 'Credit Note'],
    default: 'Tax Invoice'
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    rate: {
      type: Number,
      required: true
    },
    gst: {
      type: Number,
      default: 18
    },
    amount: Number
  }],
  subtotal: Number,
  discount: {
    type: Number,
    default: 0
  },
  discountPercent: {
    type: Number,
    default: 0
  },
  cgst: Number,
  sgst: Number,
  igst: Number,
  totalGst: Number,
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Invoice', invoiceSchema);
