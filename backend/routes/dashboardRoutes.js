const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');
const Customer = require('../models/Customer');
const Supplier = require('../models/Supplier');

// Get dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Total items in stock
    const products = await Product.find();
    const totalItems = products.reduce((sum, p) => sum + p.currentStock, 0);
    
    // Total stock value
    const totalStockValue = products.reduce((sum, p) => sum + (p.currentStock * p.purchasePrice), 0);
    
    // Low stock alerts
    const lowStockItems = await Product.find({
      $expr: { $lte: ['$currentStock', '$minStockLevel'] }
    });
    
    // Today's sales
    const todayInvoices = await Invoice.find({
      date: { $gte: today },
      invoiceType: 'Tax Invoice'
    });
    const todaySalesCount = todayInvoices.length;
    const todaysSalesAmount = todayInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    // Today's purchases
    const todayPurchases = await Purchase.find({
      date: { $gte: today }
    });
    const todayPurchaseCount = todayPurchases.length;
    const todaysPurchaseAmount = todayPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
    
    res.json({
      totalItems,
      totalStockValue,
      lowStockCount: lowStockItems.length,
      todaySalesCount,
      todaysSalesAmount,
      todayPurchaseCount,
      todaysPurchaseAmount,
      productCount: products.length,
      customerCount: await Customer.countDocuments(),
      supplierCount: await Supplier.countDocuments()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent transactions
router.get('/recent', async (req, res) => {
  try {
    const recentInvoices = await Invoice.find()
      .populate('customerId')
      .sort({ date: -1 })
      .limit(5);
    
    const recentPurchases = await Purchase.find()
      .populate('supplierId')
      .sort({ date: -1 })
      .limit(5);
    
    res.json({
      recentInvoices,
      recentPurchases
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
