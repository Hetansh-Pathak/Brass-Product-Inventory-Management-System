const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  billNo: {
    type: String,
    required: true,
    unique: true
  },
  supplierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier',
    required: true
  },
  date: {
    type: Date,
    required: true
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
  gstAmount: Number,
  additionalCharges: {
    transport: {
      type: Number,
      default: 0
    },
    labour: {
      type: Number,
      default: 0
    },
    packing: {
      type: Number,
      default: 0
    }
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentMode: {
    type: String,
    enum: ['Cash', 'Bank', 'UPI', 'Check'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  },
  billPdfUrl: String,
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

module.exports = mongoose.model('Purchase', purchaseSchema);
