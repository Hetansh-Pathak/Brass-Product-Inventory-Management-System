const express = require('express');
const router = express.Router();
const InventoryLedger = require('../models/InventoryLedger');
const Product = require('../models/Product');

// Get inventory ledger
router.get('/ledger', async (req, res) => {
  try {
    const ledger = await InventoryLedger.find()
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get stock report
router.get('/stock-report', async (req, res) => {
  try {
    const products = await Product.find();
    const report = products.map(p => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      currentStock: p.currentStock,
      minStockLevel: p.minStockLevel,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      stockValue: p.currentStock * p.purchasePrice,
      status: p.currentStock <= p.minStockLevel ? 'Low Stock' : 'In Stock'
    }));
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const lowStock = await Product.find({
      $expr: { $lte: ['$currentStock', '$minStockLevel'] }
    });
    res.json(lowStock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add stock in
router.post('/stock-in', async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    product.currentStock += req.body.quantity;
    await product.save();

    const ledger = new InventoryLedger({
      productId: req.body.productId,
      type: 'IN',
      quantity: req.body.quantity,
      reason: req.body.reason || 'Purchase',
      referenceId: req.body.referenceId,
      referenceType: req.body.referenceType || 'Purchase',
      rate: req.body.rate,
      notes: req.body.notes
    });

    const newEntry = await ledger.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add stock out
router.post('/stock-out', async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.currentStock < req.body.quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    product.currentStock -= req.body.quantity;
    await product.save();

    const ledger = new InventoryLedger({
      productId: req.body.productId,
      type: 'OUT',
      quantity: req.body.quantity,
      reason: req.body.reason || 'Invoice',
      referenceId: req.body.referenceId,
      referenceType: req.body.referenceType || 'Invoice',
      rate: req.body.rate,
      notes: req.body.notes
    });

    const newEntry = await ledger.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Adjust stock
router.post('/adjust', async (req, res) => {
  try {
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const difference = req.body.quantity - product.currentStock;
    product.currentStock = req.body.quantity;
    await product.save();

    const ledger = new InventoryLedger({
      productId: req.body.productId,
      type: 'ADJUST',
      quantity: difference,
      reason: 'Adjustment',
      referenceType: 'Manual',
      notes: req.body.reason || 'Stock adjustment'
    });

    const newEntry = await ledger.save();
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
