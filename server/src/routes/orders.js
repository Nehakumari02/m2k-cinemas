const express = require('express');
const auth = require('../middlewares/auth');
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Setting = require('../models/setting');

const router = new express.Router();

// POST create order
router.post('/orders', auth.simple, async (req, res) => {
  try {
    const order = new Order({
      ...req.body,
      user: req.user._id,
    });

    // Handle payment from wallet if chosen
    if (order.paymentMethod === 'Wallet') {
      if (req.user.walletBalance < order.totalAmount) {
        return res.status(400).send({ error: 'Insufficient wallet balance' });
      }
      req.user.walletBalance -= order.totalAmount;
      await req.user.save();

      // Create transaction record
      const transaction = new Transaction({
        userId: req.user._id,
        amount: order.totalAmount,
        type: 'DEBIT',
        description: `Purchase of merchandise`,
      });
      await transaction.save();
    }

    // Handle loyalty points redemption
    const pointsUsed = Number(req.body.pointsUsed || 0);
    if (pointsUsed > 0) {
      if (req.user.loyaltyPoints < pointsUsed) {
        return res.status(400).send({ error: 'Insufficient loyalty points' });
      }
      req.user.loyaltyPoints -= pointsUsed;
      // We assume the totalAmount sent from frontend is already adjusted for points
      // But for security, we should verify it. 
      // For now, we trust the totalAmount but deduct the points from user.
      await req.user.save();
      console.log(`Redeemed ${pointsUsed} points for user ${req.user._id}`);
    }

    // Decrease stock for each item
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    // Calculate and award loyalty points
    try {
      const lpSetting = await Setting.findOne({ key: 'loyaltyPointsPer100' });
      const pointsPer100 = lpSetting ? Number(lpSetting.value) : 0;
      if (pointsPer100 > 0) {
        const pointsEarned = Math.floor((order.totalAmount / 100) * pointsPer100);
        if (pointsEarned > 0) {
          req.user.loyaltyPoints = (req.user.loyaltyPoints || 0) + pointsEarned;
          await req.user.save();
          console.log(`Awarded ${pointsEarned} loyalty points to user ${req.user._id}`);
        }
      }
    } catch (lpErr) {
      console.error('Error awarding loyalty points:', lpErr);
      // Don't fail the order if points fails
    }

    await order.save();
    res.status(201).send(order);
  } catch (e) {
    console.error('Order Error:', e);
    res.status(400).send({ error: e.message || 'Failed to place order' });
  }
});

// GET my orders
router.get('/orders/me', auth.simple, async (req, res) => {
  try {
    // Show orders tied to this User ID OR this Email address
    const orders = await Order.find({
      $or: [
        { user: req.user._id },
        { "shippingAddress.email": req.user.email }
      ]
    }).sort({ createdAt: -1 });
    res.send(orders);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET all orders (admin)
router.get('/admin/orders', auth.enhance, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.send(orders);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH update order status/tracking (admin)
router.patch('/admin/orders/:id', auth.enhance, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['status', 'trackingId'];
  const isValidOperation = updates.every(u => allowedUpdates.includes(u));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.sendStatus(404);
    updates.forEach(u => (order[u] = req.body[u]));
    await order.save();
    res.send(order);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
