const express = require('express');
const router = express.Router();
const Supplier = require('../models/Supplier');

// Get all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single supplier
router.get('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create supplier
router.post('/', async (req, res) => {
  const supplier = new Supplier({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    gstin: req.body.gstin,
    bankName: req.body.bankName,
    accountNo: req.body.accountNo,
    ifsc: req.body.ifsc,
    paymentTerms: req.body.paymentTerms
  });

  try {
    const newSupplier = await supplier.save();
    res.status(201).json(newSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update supplier
router.put('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });

    if (req.body.name) supplier.name = req.body.name;
    if (req.body.phone) supplier.phone = req.body.phone;
    if (req.body.email) supplier.email = req.body.email;
    if (req.body.address) supplier.address = req.body.address;
    if (req.body.city) supplier.city = req.body.city;
    if (req.body.state) supplier.state = req.body.state;
    if (req.body.pincode) supplier.pincode = req.body.pincode;
    if (req.body.gstin) supplier.gstin = req.body.gstin;
    if (req.body.bankName) supplier.bankName = req.body.bankName;
    if (req.body.accountNo) supplier.accountNo = req.body.accountNo;
    if (req.body.ifsc) supplier.ifsc = req.body.ifsc;
    if (req.body.paymentTerms) supplier.paymentTerms = req.body.paymentTerms;
    supplier.updatedAt = Date.now();

    const updatedSupplier = await supplier.save();
    res.json(updatedSupplier);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete supplier
router.delete('/:id', async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Supplier not found' });
    
    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
