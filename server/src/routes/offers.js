const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Offer = require('../models/offer');

const router = new express.Router();

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
    const offer = new Offer(req.body);
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
    const url = `${req.protocol}://${req.get('host')}`;
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
      offer.image = `${url}/${file.path}`;
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
  const allowedUpdates = ['title', 'description', 'code', 'validTill', 'image', 'isActive'];
  const isValidOperation = updates.every(u => allowedUpdates.includes(u));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const offer = await Offer.findById(_id);
    if (!offer) return res.sendStatus(404);
    updates.forEach(u => (offer[u] = req.body[u]));
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
