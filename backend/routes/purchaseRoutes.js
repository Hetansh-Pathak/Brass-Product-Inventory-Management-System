const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const InventoryLedger = require('../models/InventoryLedger');
const Product = require('../models/Product');

// Get all purchases
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find()
      .populate('supplierId')
      .populate('items.productId')
      .sort({ date: -1 });
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single purchase
router.get('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id)
      .populate('supplierId')
      .populate('items.productId');
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    res.json(purchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create purchase
router.post('/', async (req, res) => {
  try {
    let subtotal = 0;
    let gstAmount = 0;

    const items = req.body.items.map(item => {
      const amount = item.quantity * item.rate;
      const itemGst = (amount * item.gst) / 100;
      subtotal += amount;
      gstAmount += itemGst;
      return {
        ...item,
        amount: amount
      };
    });

    const additionalCharges = req.body.additionalCharges || {};
    const totalAdditional = (additionalCharges.transport || 0) + 
                            (additionalCharges.labour || 0) + 
                            (additionalCharges.packing || 0);

    const totalAmount = subtotal + gstAmount + totalAdditional;

    const purchase = new Purchase({
      billNo: req.body.billNo,
      supplierId: req.body.supplierId,
      date: req.body.date,
      items: items,
      subtotal: subtotal,
      gstAmount: gstAmount,
      additionalCharges: additionalCharges,
      totalAmount: totalAmount,
      paymentMode: req.body.paymentMode,
      paymentStatus: req.body.paymentStatus || 'Unpaid',
      billPdfUrl: req.body.billPdfUrl,
      notes: req.body.notes
    });

    const newPurchase = await purchase.save();

    // Update stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.currentStock += item.quantity;
        await product.save();

        // Create inventory ledger entry
        const ledger = new InventoryLedger({
          productId: item.productId,
          type: 'IN',
          quantity: item.quantity,
          reason: 'Purchase',
          referenceId: newPurchase._id,
          referenceType: 'Purchase',
          rate: item.rate
        });
        await ledger.save();
      }
    }

    res.status(201).json(newPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update purchase
router.put('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    if (req.body.billNo) purchase.billNo = req.body.billNo;
    if (req.body.supplierId) purchase.supplierId = req.body.supplierId;
    if (req.body.date) purchase.date = req.body.date;
    if (req.body.paymentStatus) purchase.paymentStatus = req.body.paymentStatus;
    if (req.body.notes) purchase.notes = req.body.notes;
    purchase.updatedAt = Date.now();

    const updatedPurchase = await purchase.save();
    res.json(updatedPurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete purchase
router.delete('/:id', async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

    // Reverse stock updates
    for (const item of purchase.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.currentStock -= item.quantity;
        await product.save();
      }
      // Remove ledger entries
      await InventoryLedger.deleteMany({ referenceId: req.params.id });
    }

    await Purchase.findByIdAndDelete(req.params.id);
    res.json({ message: 'Purchase deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
