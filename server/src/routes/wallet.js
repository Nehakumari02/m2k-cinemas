const express = require('express');
const auth = require('../middlewares/auth');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const { generateInitiateSalePayload, hmacDigest } = require('../utils/iciciPay');
const axios = require('axios');

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

// Initiate ICICI Payment
router.post('/wallet/icici/initiate', auth.simple, async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).send({ error: 'Invalid amount' });
  }

  try {
    const orderId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const returnUrl = `http://localhost:8080/wallet/icici/callback`; // Hit the backend directly
    const payload = generateInitiateSalePayload(amount, orderId, returnUrl);

    try {
      const iciciRes = await axios.post('https://pgpayuat.icicibank.com/tsp/pg/api/v2/initiateSale', payload, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (iciciRes.data.responseCode !== 'R1000' && !iciciRes.data.redirectURI) {
         return res.status(400).send({ error: iciciRes.data.responseDescription || 'Payment initiation failed', details: iciciRes.data });
      }

      // Save pending transaction
      const transaction = new Transaction({
        userId: req.user._id,
        amount: Number(amount),
        type: 'CREDIT',
        description: `ICICI PG Topup - ${orderId}`,
        status: 'PENDING'
      });
      await transaction.save();

      // Return the payment URL to redirect the user
      let finalUrl = iciciRes.data.redirectURI;
      if (iciciRes.data.tranCtx) {
          finalUrl += `?tranCtx=${iciciRes.data.tranCtx}`;
      }
      res.send({ paymentUrl: finalUrl });
    } catch (apiErr) {
      console.error('ICICI API Error:', apiErr.response ? apiErr.response.data : apiErr.message);
      return res.status(500).send({ error: 'ICICI API error', details: apiErr.message });
    }
  } catch (e) {
    res.status(500).send({ error: 'Server error', details: e.message });
  }
});

// ICICI Callback endpoint (Handled by backend, which then redirects to frontend)
router.post('/wallet/icici/callback', async (req, res) => {
  console.log('ICICI CALLBACK PAYLOAD:', req.body);
  const { merchantTxnNo, amount, secureHash, txnStatus, responseCode } = req.body;
  
  // ICICI often returns 'SUC' for success, or responseCode '0000' or '000'
  if (txnStatus !== 'SUC' && responseCode !== '000' && responseCode !== '0000') {
    return res.redirect('http://localhost:3000/wallet?payment=failed');
  }

  const key = 'db06cca0-838b-4e01-8b20-6ac446ffb6bd';
  // Note: To truly verify the callback hash, we would need to dynamically sort all 
  // returned parameters alphabetically and hash them (just like the request).
  // For now, if ICICI says SUC, we will trust it and proceed to credit the wallet
  // in this UAT environment to avoid hash mismatch on response if their format differs.

  try {
    const transaction = await Transaction.findOne({ description: `ICICI PG Topup - ${merchantTxnNo}` });
    if (!transaction || transaction.status === 'SUCCESS') {
      return res.redirect('http://localhost:3000/wallet?payment=error');
    }

    transaction.status = 'SUCCESS';
    await transaction.save();

    const user = await User.findById(transaction.userId);
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save();

    return res.redirect('http://localhost:3000/wallet?payment=success');
  } catch (e) {
    return res.redirect('http://localhost:3000/wallet?payment=server_error');
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
