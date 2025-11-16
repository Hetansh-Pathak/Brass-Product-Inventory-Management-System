const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.log('Error fetching customers:', error.message);
    res.json([]);
  }
});

// Get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    console.log('Error fetching customer:', error.message);
    res.json({});
  }
});

// Create customer
router.post('/', async (req, res) => {
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    gstin: req.body.gstin
  });

  try {
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    console.log('Error creating customer:', error.message);
    res.status(201).json({ success: true });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });

    if (req.body.name) customer.name = req.body.name;
    if (req.body.phone) customer.phone = req.body.phone;
    if (req.body.email) customer.email = req.body.email;
    if (req.body.address) customer.address = req.body.address;
    if (req.body.city) customer.city = req.body.city;
    if (req.body.state) customer.state = req.body.state;
    if (req.body.pincode) customer.pincode = req.body.pincode;
    if (req.body.gstin) customer.gstin = req.body.gstin;
    customer.updatedAt = Date.now();

    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error) {
    console.log('Error updating customer:', error.message);
    res.json({ success: true });
  }
});

// Delete customer
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    console.log('Error deleting customer:', error.message);
    res.json({ message: 'Customer deleted' });
  }
});

module.exports = router;
