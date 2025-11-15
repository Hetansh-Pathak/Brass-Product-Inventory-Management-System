const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Raw Material', 'Components', 'Finished Goods'],
    required: true
  },
  description: String,
  uom: {
    type: String,
    enum: ['PCS', 'KG', 'SET', 'LOT', 'METER', 'CUSTOM'],
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  },
  sellingPrice: {
    type: Number,
    required: true
  },
  gstPercent: {
    type: Number,
    default: 18
  },
  openingStock: {
    type: Number,
    default: 0
  },
  currentStock: {
    type: Number,
    default: 0
  },
  minStockLevel: {
    type: Number,
    default: 10
  },
  imageUrl: String,
  brassType: String,
  weightPerUnit: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
