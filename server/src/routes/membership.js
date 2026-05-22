const express = require('express');
const crypto = require('crypto');
const auth = require('../middlewares/auth');
const Membership = require('../models/membership');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const { normalizeMembershipPlan } = require('../utils/membershipDefaults');

const router = new express.Router();

const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return false;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');
  return expected === signature;
};

const activateMembership = async (user, plan, paymentNote) => {
  user.membership = plan._id;
  const expiry = new Date();
  expiry.setFullYear(expiry.getFullYear() + 1);
  user.membershipExpiresAt = expiry;
  user.membershipGstBenefitUsed = false;
  await user.save();

  await Transaction.create({
    userId: user._id,
    amount: plan.price,
    type: 'DEBIT',
    description: `${plan.name} membership (1 year) — ${paymentNote}`,
    status: 'SUCCESS',
  });

  return User.findById(user._id).populate('membership');
};

router.get('/memberships', async (req, res) => {
  try {
    const plans = await Membership.find({});
    res.send(plans.map(normalizeMembershipPlan));
  } catch (e) {
    res.status(500).send();
  }
});

/**
 * Purchase membership — wallet or online (Card / UPI / Net Banking via Razorpay).
 * Body: { planId, paymentMethod: 'wallet' | 'online', razorpay_order_id?, razorpay_payment_id?, razorpay_signature? }
 */
router.post('/memberships/purchase', auth.simple, async (req, res) => {
  const {
    planId,
    paymentMethod = 'wallet',
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body;

  try {
    const plan = await Membership.findById(planId);
    if (!plan) {
      return res.status(404).send({ error: 'Plan not found' });
    }

    const user = await User.findById(req.user._id);

    if (paymentMethod === 'online') {
      if (!orderId || !paymentId || !signature) {
        return res.status(400).send({
          error: 'Online payment details are required',
        });
      }
      if (!verifyRazorpaySignature({ orderId, paymentId, signature })) {
        return res.status(400).send({ error: 'Payment verification failed' });
      }

      const populated = await activateMembership(user, plan, 'Card/UPI/Net Banking');
      if (populated.membership) {
        populated.membership = normalizeMembershipPlan(populated.membership);
      }
      return res.send({
        user: populated,
        message: `Successfully upgraded to ${plan.name} membership!`,
      });
    }

    if (user.walletBalance < plan.price) {
      return res.status(400).send({
        error: 'Insufficient wallet balance. Add money to wallet or pay with Card/UPI.',
      });
    }

    user.walletBalance -= plan.price;
    const populated = await activateMembership(user, plan, 'M2K Wallet');
    if (populated.membership) {
      populated.membership = normalizeMembershipPlan(populated.membership);
    }
    res.send({
      user: populated,
      message: `Successfully upgraded to ${plan.name} membership!`,
    });
  } catch (e) {
    console.error('Membership purchase error:', e);
    res.status(400).send({ error: e.message || 'Purchase failed' });
  }
});

module.exports = router;
