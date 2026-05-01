const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const Transaction = require('../models/transaction');

const router = new express.Router();

// Get Wallet Balance & History
router.get('/wallet/me', auth.simple, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.send({
      balance: user.walletBalance || 0,
      loyaltyPoints: user.loyaltyPoints || 0,
      transactions
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Add Money to Wallet (Simulated Payment Gateway)
router.post('/wallet/add', auth.simple, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).send({ error: 'Invalid amount' });
  }

  try {
    const user = await User.findById(req.user._id);
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      amount: Number(amount),
      type: 'CREDIT',
      description: 'Added money to wallet via Payment Gateway',
      status: 'SUCCESS'
    });
    await transaction.save();

    res.send({ balance: user.walletBalance, transaction });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Admin Add Money to User Wallet
router.post('/wallet/admin/add', auth.enhance, async (req, res) => {
  if (req.user.role !== 'superadmin' && req.user.role !== 'admin') {
    return res.status(403).send({ error: 'Only admins can perform this action' });
  }

  const { userId, amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).send({ error: 'Invalid amount' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).send({ error: 'User not found' });

    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      amount: Number(amount),
      type: 'CREDIT',
      description: `Funds added by Admin (${req.user.username})`,
      status: 'SUCCESS'
    });
    await transaction.save();

    res.send({ message: 'Funds added successfully', balance: user.walletBalance, transaction });
  } catch (e) {
    res.status(500).send(e);
  }
});

// Pay using Wallet (Internal API for Checkout)
router.post('/wallet/pay', auth.simple, async (req, res) => {
  const { amount, description } = req.body;
  
  try {
    const user = await User.findById(req.user._id);
    if (user.walletBalance < amount) {
      return res.status(400).send({ error: 'Insufficient wallet balance' });
    }

    user.walletBalance -= Number(amount);
    await user.save();

    const transaction = new Transaction({
      userId: user._id,
      amount: Number(amount),
      type: 'DEBIT',
      description: description || 'Payment for movie booking',
      status: 'SUCCESS'
    });
    await transaction.save();

    res.send({ balance: user.walletBalance, transaction });
  } catch (e) {
    res.status(500).send(e);
  }
});

module.exports = router;
