const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const InventoryLedger = require('../models/InventoryLedger');

// Sales report
router.get('/sales', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = { invoiceType: 'Tax Invoice' };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const invoices = await Invoice.find(filter)
      .populate('customerId')
      .populate('items.productId')
      .sort({ date: -1 });
    
    const totalSales = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const totalItems = invoices.reduce((sum, inv) => sum + inv.items.length, 0);
    
    res.json({
      invoices,
      totalSales,
      totalItems,
      invoiceCount: invoices.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase report
router.get('/purchase', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = {};
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const purchases = await Purchase.find(filter)
      .populate('supplierId')
      .populate('items.productId')
      .sort({ date: -1 });
    
    const totalPurchases = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalItems = purchases.reduce((sum, p) => sum + p.items.length, 0);
    
    res.json({
      purchases,
      totalPurchases,
      totalItems,
      purchaseCount: purchases.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stock ledger report
router.get('/stock-ledger', async (req, res) => {
  try {
    const { productId } = req.query;
    
    let filter = {};
    if (productId) {
      filter.productId = productId;
    }
    
    const ledger = await InventoryLedger.find(filter)
      .populate('productId')
      .sort({ createdAt: -1 });
    
    res.json(ledger);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Stock valuation report
router.get('/stock-valuation', async (req, res) => {
  try {
    const products = await Product.find();
    
    const valuation = products.map(p => ({
      id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      quantity: p.currentStock,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      valuationAmount: p.currentStock * p.purchasePrice,
      sellingValue: p.currentStock * p.sellingPrice
    }));
    
    const totalValuation = valuation.reduce((sum, item) => sum + item.valuationAmount, 0);
    const totalSellingValue = valuation.reduce((sum, item) => sum + item.sellingValue, 0);
    
    res.json({
      valuation,
      totalValuation,
      totalSellingValue,
      potentialProfit: totalSellingValue - totalValuation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GST report
router.get('/gst', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let filter = { invoiceType: 'Tax Invoice' };
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const invoices = await Invoice.find(filter)
      .populate('customerId');
    
    const totalCGST = invoices.reduce((sum, inv) => sum + (inv.cgst || 0), 0);
    const totalSGST = invoices.reduce((sum, inv) => sum + (inv.sgst || 0), 0);
    const totalIGST = invoices.reduce((sum, inv) => sum + (inv.igst || 0), 0);
    const totalGST = totalCGST + totalSGST + totalIGST;
    
    res.json({
      invoices,
      totalCGST,
      totalSGST,
      totalIGST,
      totalGST,
      invoiceCount: invoices.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profit/Loss report
router.get('/profit-loss', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let invoiceFilter = { invoiceType: 'Tax Invoice' };
    let purchaseFilter = {};
    
    if (startDate && endDate) {
      invoiceFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
      purchaseFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const invoices = await Invoice.find(invoiceFilter);
    const purchases = await Purchase.find(purchaseFilter);
    
    const totalSales = invoices.reduce((sum, inv) => sum + inv.subtotal, 0);
    const totalPurchaseCost = purchases.reduce((sum, p) => sum + p.subtotal, 0);
    const profit = totalSales - totalPurchaseCost;
    const profitMargin = totalSales > 0 ? (profit / totalSales) * 100 : 0;
    
    res.json({
      totalSales,
      totalPurchaseCost,
      profit,
      profitMargin,
      invoiceCount: invoices.length,
      purchaseCount: purchases.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
