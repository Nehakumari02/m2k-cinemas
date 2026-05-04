const express = require('express');
const auth = require('../middlewares/auth');
const Refund = require('../models/refund');
const Reservation = require('../models/reservation');
const Order = require('../models/order');
const User = require('../models/user');
const Transaction = require('../models/transaction');

const router = new express.Router();

// Submit a refund request
router.post('/refunds', auth.simple, async (req, res) => {
  const { originalId, type, reason, amount } = req.body;
  
  try {
    const refund = new Refund({
      originalId,
      type,
      reason,
      amount,
      user: req.user._id
    });

    await refund.save();

    // Update the original item status
    if (type === 'Reservation') {
      await Reservation.findByIdAndUpdate(originalId, { status: 'Refund Requested' });
    } else {
      await Order.findByIdAndUpdate(originalId, { status: 'Refund Requested' });
    }

    res.status(201).send(refund);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get current user's refund requests
router.get('/refunds/me', auth.simple, async (req, res) => {
  try {
    const refunds = await Refund.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.send(refunds);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all refund requests (Admin only)
router.get('/refunds', auth.enhance, async (req, res) => {
  try {
    const refunds = await Refund.find({})
      .populate('user', 'name email username')
      .sort({ createdAt: -1 });
    res.send(refunds);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update refund status (Admin only)
router.patch('/refunds/:id', auth.enhance, async (req, res) => {
  const { status, adminNote } = req.body;
  
  try {
    const refund = await Refund.findById(req.params.id);
    if (!refund) return res.status(404).send();

    refund.status = status;
    refund.adminNote = adminNote;
    await refund.save();

    // If approved, update the original item status to 'Refunded'
    // If rejected, update back to 'Paid' or 'Delivered' (depending on type)
    if (status === 'Approved') {
      if (refund.type === 'Reservation') {
        await Reservation.findByIdAndUpdate(refund.originalId, { status: 'Refunded' });
      } else {
        await Order.findByIdAndUpdate(refund.originalId, { status: 'Refunded' });
      }

      // CREDIT user's wallet
      const user = await User.findById(refund.user);
      if (user) {
        user.walletBalance = (user.walletBalance || 0) + refund.amount;
        await user.save();

        const transaction = new Transaction({
          userId: user._id,
          amount: refund.amount,
          type: 'CREDIT',
          description: `Refund for ${refund.type} #${refund.originalId.toString().slice(-6).toUpperCase()}`,
          status: 'SUCCESS'
        });
        await transaction.save();
      }
    } else if (status === 'Rejected') {
      if (refund.type === 'Reservation') {
        await Reservation.findByIdAndUpdate(refund.originalId, { status: 'Paid' });
      } else {
        await Order.findByIdAndUpdate(refund.originalId, { status: 'Delivered' });
      }
    }

    res.send(refund);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
