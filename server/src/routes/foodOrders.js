const express = require('express');
const auth = require('../middlewares/auth');
const FoodOrder = require('../models/foodOrder');
const Transaction = require('../models/transaction');
const Setting = require('../models/setting');

const router = new express.Router();

router.post('/food-orders', auth.simple, async (req, res) => {
  try {
    const order = new FoodOrder({
      ...req.body,
      user: req.user._id,
    });

    if (order.paymentMethod === 'Wallet') {
      if (req.user.walletBalance < order.totalAmount) {
        return res.status(400).send({ error: 'Insufficient wallet balance' });
      }
      req.user.walletBalance -= order.totalAmount;
      await req.user.save();

      const transaction = new Transaction({
        userId: req.user._id,
        amount: order.totalAmount,
        type: 'DEBIT',
        description: 'Food & combos order',
      });
      await transaction.save();
    }

    const pointsUsed = Number(req.body.pointsUsed || 0);
    if (pointsUsed > 0) {
      if (req.user.loyaltyPoints < pointsUsed) {
        return res.status(400).send({ error: 'Insufficient loyalty points' });
      }
      req.user.loyaltyPoints -= pointsUsed;
      await req.user.save();
    }

    try {
      const lpSetting = await Setting.findOne({ key: 'loyaltyPointsPer100' });
      const pointsPer100 = lpSetting ? Number(lpSetting.value) : 0;
      if (pointsPer100 > 0) {
        const pointsEarned = Math.floor((order.totalAmount / 100) * pointsPer100);
        if (pointsEarned > 0) {
          req.user.loyaltyPoints = (req.user.loyaltyPoints || 0) + pointsEarned;
          await req.user.save();
        }
      }
    } catch (lpErr) {
      console.error('Error awarding loyalty points for food order:', lpErr);
    }

    await order.save();
    res.status(201).send(order);
  } catch (e) {
    console.error('Food order error:', e);
    res.status(400).send({ error: e.message || 'Could not place food order' });
  }
});

router.get('/food-orders/me', auth.simple, async (req, res) => {
  try {
    const orders = await FoodOrder.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.send(orders);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/admin/food-orders', auth.enhance, async (req, res) => {
  try {
    const orders = await FoodOrder.find({})
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.send(orders);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/admin/food-orders/:id', auth.enhance, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['status'];
  const isValidOperation = updates.every(u => allowedUpdates.includes(u));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const order = await FoodOrder.findById(req.params.id);
    if (!order) return res.sendStatus(404);
    updates.forEach(u => {
      order[u] = req.body[u];
    });
    await order.save();
    res.send(order);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
