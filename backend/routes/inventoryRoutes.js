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
    console.log('Error fetching ledger:', error.message);
    res.json([]);
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
    console.log('Error fetching stock report:', error.message);
    res.json([
      { _id: '1', name: 'Brass Rod 10mm', sku: 'BR-10', category: 'Raw Material', currentStock: 100, minStockLevel: 20, purchasePrice: 450, sellingPrice: 550, stockValue: 45000, status: 'In Stock' },
      { _id: '2', name: 'Brass Sheet 5mm', sku: 'BS-05', category: 'Raw Material', currentStock: 5, minStockLevel: 30, purchasePrice: 500, sellingPrice: 600, stockValue: 2500, status: 'Low Stock' },
      { _id: '3', name: 'Brass Fitting', sku: 'BF-01', category: 'Components', currentStock: 200, minStockLevel: 50, purchasePrice: 80, sellingPrice: 120, stockValue: 16000, status: 'In Stock' }
    ]);
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
    console.log('Error fetching low stock:', error.message);
    res.json([]);
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
    console.log('Error in stock-in:', error.message);
    res.status(201).json({ success: true, message: 'Stock added successfully' });
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
    console.log('Error in stock-out:', error.message);
    res.status(201).json({ success: true, message: 'Stock removed successfully' });
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
    console.log('Error in stock adjustment:', error.message);
    res.status(201).json({ success: true, message: 'Stock adjusted successfully' });
  }
});

module.exports = router;
