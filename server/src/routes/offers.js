const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Offer = require('../models/offer');
const User = require('../models/user');
const {
  isEligibleForMembershipOffer,
  normalizeMembershipTiers,
} = require('../utils/membershipOffer');

const router = new express.Router();

// POST validate offer code
router.post('/offers/validate', auth.simple, async (req, res) => {
  const { code, ticketCount } = req.body;
  if (!code) {
    return res.status(400).send({ error: 'Coupon code is required' });
  }

  try {
    const offer = await Offer.findOne({ code: code.toUpperCase() });

    if (!offer) {
      return res.status(404).send({ error: 'Invalid coupon code' });
    }

    if (!offer.isActive) {
      return res.status(400).send({ error: 'This coupon is no longer active' });
    }

    if (new Date(offer.validTill) < new Date()) {
      return res.status(400).send({ error: 'This coupon has expired' });
    }

    if (offer.inquiryOnly) {
      return res.status(400).send({
        error:
          'This offer is for school group enquiries only. Submit an enquiry on the School Group Booking page.',
      });
    }

    const seats = Number(ticketCount) || 0;
    if (offer.category === 'school_group' && offer.minTickets > 0 && seats < offer.minTickets) {
      return res.status(400).send({
        error: `This school group code requires at least ${offer.minTickets} tickets in your booking.`,
      });
    }

    if (offer.category === 'membership') {
      const user = await User.findById(req.user._id).populate('membership');
      if (!isEligibleForMembershipOffer(user, offer)) {
        const tiers = normalizeMembershipTiers(offer.membershipTiers);
        const tierLabel = tiers.length ? tiers.join(', ') : 'M2K membership';
        return res.status(403).send({
          error: `This offer is for ${tierLabel} members only. Join or upgrade your membership to use this code.`,
        });
      }
    }

    res.send({
      valid: true,
      discountPercentage: offer.discountPercentage,
      category: offer.category,
      minTickets: offer.minTickets,
    });
  } catch (e) {
    res.status(500).send({ error: 'Server error validating coupon' });
  }
});


// GET all offers (public)
router.get('/offers', async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.send(offers);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET all offers including inactive (admin only)
router.get('/admin/offers', auth.enhance, async (req, res) => {
  try {
    const offers = await Offer.find({}).sort({ createdAt: -1 });
    res.send(offers);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET single offer
router.get('/offers/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) return res.sendStatus(404);
    res.send(offer);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST create offer (admin)
router.post('/offers', auth.enhance, async (req, res) => {
  try {
    const payload = { ...req.body };
    if (payload.category === 'membership') {
      payload.membershipTiers = normalizeMembershipTiers(payload.membershipTiers);
      if (!payload.membershipTiers.length) {
        return res.status(400).send({
          error: { message: 'Select at least one membership tier for member offers.' },
        });
      }
    } else {
      payload.membershipTiers = [];
    }
    const offer = new Offer(payload);
    await offer.save();
    res.status(201).send(offer);
  } catch (e) {
    res.status(400).send(e);
  }
});

// POST upload offer image (admin)
router.post(
  '/offers/photo/:id',
  auth.enhance,
  upload('offers').single('file'),
  async (req, res, next) => {
    const { file } = req;
    const offerId = req.params.id;
    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const offer = await Offer.findById(offerId);
      if (!offer) return res.sendStatus(404);
      offer.image = `/${file.path}`;
      await offer.save();
      res.send({ offer, file });
    } catch (e) {
      console.log(e);
      res.sendStatus(400);
    }
  }
);

// PUT update offer (admin)
router.put('/offers/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'title',
    'description',
    'code',
    'validTill',
    'image',
    'isActive',
    'discountPercentage',
    'category',
    'minTickets',
    'inquiryOnly',
    'membershipTiers',
  ];
  const isValidOperation = updates.every(u => allowedUpdates.includes(u));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const offer = await Offer.findById(_id);
    if (!offer) return res.sendStatus(404);
    updates.forEach(u => {
      if (u === 'membershipTiers') {
        offer.membershipTiers = normalizeMembershipTiers(req.body.membershipTiers);
        return;
      }
      offer[u] = req.body[u];
    });
    if (offer.category === 'membership' && !offer.membershipTiers.length) {
      return res.status(400).send({
        error: { message: 'Select at least one membership tier for member offers.' },
      });
    }
    if (offer.category !== 'membership') {
      offer.membershipTiers = [];
    }
    await offer.save();
    res.send(offer);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE offer (admin)
router.delete('/offers/:id', auth.enhance, async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) return res.sendStatus(404);
    res.send(offer);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
