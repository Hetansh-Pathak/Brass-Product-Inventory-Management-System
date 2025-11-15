const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');
const InventoryLedger = require('../models/InventoryLedger');
const Product = require('../models/Product');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customerId')
      .populate('items.productId')
      .sort({ date: -1 });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single invoice
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customerId')
      .populate('items.productId');
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create invoice
router.post('/', async (req, res) => {
  try {
    let subtotal = 0;
    let totalGst = 0;

    const items = req.body.items.map(item => {
      const amount = item.quantity * item.rate;
      const itemGst = (amount * item.gst) / 100;
      subtotal += amount;
      totalGst += itemGst;
      return {
        ...item,
        amount: amount
      };
    });

    const discountAmount = req.body.discount || 0;
    const discountPercent = req.body.discountPercent || 0;
    const finalDiscount = discountAmount || (subtotal * discountPercent / 100);

    const taxableAmount = subtotal - finalDiscount;
    const cgst = (taxableAmount * 9) / 100;
    const sgst = (taxableAmount * 9) / 100;
    const totalAmount = taxableAmount + cgst + sgst;

    const invoice = new Invoice({
      invoiceNo: req.body.invoiceNo,
      customerId: req.body.customerId,
      date: req.body.date,
      invoiceType: req.body.invoiceType || 'Tax Invoice',
      items: items,
      subtotal: subtotal,
      discount: finalDiscount,
      discountPercent: discountPercent,
      cgst: cgst,
      sgst: sgst,
      totalGst: cgst + sgst,
      totalAmount: totalAmount,
      paymentStatus: req.body.paymentStatus || 'Unpaid',
      notes: req.body.notes
    });

    const newInvoice = await invoice.save();

    // Update stock for each item
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && req.body.invoiceType !== 'Estimate' && req.body.invoiceType !== 'Delivery Challan') {
        product.currentStock -= item.quantity;
        await product.save();

        // Create inventory ledger entry
        const ledger = new InventoryLedger({
          productId: item.productId,
          type: 'OUT',
          quantity: item.quantity,
          reason: 'Invoice',
          referenceId: newInvoice._id,
          referenceType: 'Invoice',
          rate: item.rate
        });
        await ledger.save();
      }
    }

    res.status(201).json(newInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    if (req.body.paymentStatus) invoice.paymentStatus = req.body.paymentStatus;
    if (req.body.notes) invoice.notes = req.body.notes;
    invoice.updatedAt = Date.now();

    const updatedInvoice = await invoice.save();
    res.json(updatedInvoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    // Reverse stock updates if not estimate or challan
    if (invoice.invoiceType !== 'Estimate' && invoice.invoiceType !== 'Delivery Challan') {
      for (const item of invoice.items) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.currentStock += item.quantity;
          await product.save();
        }
        await InventoryLedger.deleteMany({ referenceId: req.params.id });
      }
    }

    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
