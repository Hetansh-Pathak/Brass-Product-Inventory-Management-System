const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create product
router.post('/', async (req, res) => {
  const product = new Product({
    name: req.body.name,
    sku: req.body.sku,
    category: req.body.category,
    description: req.body.description,
    uom: req.body.uom,
    purchasePrice: req.body.purchasePrice,
    sellingPrice: req.body.sellingPrice,
    gstPercent: req.body.gstPercent || 18,
    openingStock: req.body.openingStock || 0,
    currentStock: req.body.openingStock || 0,
    minStockLevel: req.body.minStockLevel || 10,
    imageUrl: req.body.imageUrl,
    brassType: req.body.brassType,
    weightPerUnit: req.body.weightPerUnit
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (req.body.name) product.name = req.body.name;
    if (req.body.sku) product.sku = req.body.sku;
    if (req.body.category) product.category = req.body.category;
    if (req.body.description) product.description = req.body.description;
    if (req.body.uom) product.uom = req.body.uom;
    if (req.body.purchasePrice) product.purchasePrice = req.body.purchasePrice;
    if (req.body.sellingPrice) product.sellingPrice = req.body.sellingPrice;
    if (req.body.gstPercent) product.gstPercent = req.body.gstPercent;
    if (req.body.minStockLevel) product.minStockLevel = req.body.minStockLevel;
    if (req.body.imageUrl) product.imageUrl = req.body.imageUrl;
    if (req.body.brassType) product.brassType = req.body.brassType;
    if (req.body.weightPerUnit) product.weightPerUnit = req.body.weightPerUnit;
    product.updatedAt = Date.now();

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
