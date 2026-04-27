const express = require('express');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const auth = require('../middlewares/auth');

const router = new express.Router();

const getRazorpayClient = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    return null;
  }
  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

router.get('/payments/config', auth.simple, async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(500).send({ error: 'Payment gateway not configured' });
  }
  return res.send({ keyId: process.env.RAZORPAY_KEY_ID });
});

router.post('/payments/create-order', auth.simple, async (req, res) => {
  try {
    const razorpay = getRazorpayClient();
    if (!razorpay) {
      return res.status(500).send({ error: 'Payment gateway not configured' });
    }

    const amount = Number(req.body.amount || 0);
    if (!amount || amount <= 0) {
      return res.status(400).send({ error: 'Invalid payment amount' });
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });
    return res.status(201).send({ order });
  } catch (e) {
    return res.status(400).send({ error: 'Unable to create payment order' });
  }
});

router.post('/payments/verify', auth.simple, async (req, res) => {
  try {
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
    } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).send({ verified: false, error: 'Missing payment details' });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).send({ verified: false, error: 'Payment gateway not configured' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).send({ verified: false, error: 'Payment verification failed' });
    }

    return res.send({ verified: true });
  } catch (e) {
    return res.status(400).send({ verified: false, error: 'Payment verification failed' });
  }
});

module.exports = router;
