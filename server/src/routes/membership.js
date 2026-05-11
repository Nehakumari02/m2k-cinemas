const express = require('express');
const auth = require('../middlewares/auth');
const Membership = require('../models/membership');
const User = require('../models/user');

const router = new express.Router();

// Get all membership plans
router.get('/memberships', async (req, res) => {
  try {
    const plans = await Membership.find({});
    res.send(plans);
  } catch (e) {
    res.status(500).send();
  }
});

// Purchase/Upgrade membership
router.post('/memberships/purchase', auth.simple, async (req, res) => {
  const { planId } = req.body;
  try {
    const plan = await Membership.findById(planId);
    if (!plan) {
      return res.status(404).send({ error: 'Plan not found' });
    }

    const user = await User.findById(req.user._id);
    
    // Check wallet balance
    if (user.walletBalance < plan.price) {
      return res.status(400).send({ error: 'Insufficient wallet balance' });
    }

    // Process payment
    user.walletBalance -= plan.price;
    user.membership = plan._id;
    
    // Membership valid for 1 year
    const expiry = new Date();
    expiry.setFullYear(expiry.getFullYear() + 1);
    user.membershipExpiresAt = expiry;

    await user.save();
    res.send({ user, message: `Successfully upgraded to ${plan.name} membership!` });
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
