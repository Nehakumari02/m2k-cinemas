const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Product = require('../models/product');

const router = new express.Router();

// GET all products (public)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.send(products);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET all products (admin)
router.get('/admin/products', auth.enhance, async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.send(products);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST create product (admin)
router.post('/products', auth.enhance, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST upload product image (admin)
router.post(
  '/products/photo/:id',
  auth.enhance,
  upload('products').single('file'),
  async (req, res, next) => {
    const { file } = req;
    const productId = req.params.id;
    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const product = await Product.findById(productId);
      if (!product) return res.sendStatus(404);
      product.image = `/${file.path}`;
      await product.save();
      res.send({ product, file });
    } catch (e) {
      res.sendStatus(400);
    }
  }
);

// PUT update product (admin)
router.put('/products/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'description', 'price', 'category', 'stock', 'isActive'];
  const isValidOperation = updates.every(u => allowedUpdates.includes(u));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const product = await Product.findById(_id);
    if (!product) return res.sendStatus(404);
    updates.forEach(u => (product[u] = req.body[u]));
    await product.save();
    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE product (admin)
router.delete('/products/:id', auth.enhance, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.sendStatus(404);
    res.send(product);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
