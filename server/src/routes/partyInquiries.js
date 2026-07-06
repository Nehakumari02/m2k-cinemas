const express = require('express');
const auth = require('../middlewares/auth');
const PartyInquiry = require('../models/partyInquiry');

const router = new express.Router();

router.post('/party-inquiries', async (req, res) => {
  try {
    const {
      partyType,
      partyName,
      contactName,
      email,
      phone,
      guestCount,
      ageGroup,
      preferredDate,
      preferredMovie,
      preferredCinema,
      offerCode,
      message,
    } = req.body;

    if (!partyType || !partyName || !contactName || !email || !phone || !guestCount) {
      return res.status(400).send({
        error: { message: 'Party type, party name, contact name, email, phone, and guest count are required.' },
      });
    }

    const inquiry = new PartyInquiry({
      partyType,
      partyName,
      contactName,
      email,
      phone,
      guestCount: Number(guestCount),
      ageGroup,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      preferredMovie,
      preferredCinema,
      offerCode,
      message,
    });

    await inquiry.save();
    res.status(201).send({ inquiry, message: 'Your party booking enquiry was submitted successfully.' });
  } catch (e) {
    console.error('Party inquiry error:', e);
    res.status(400).send({
      error: { message: 'Could not submit enquiry. Please check your details and try again.' },
    });
  }
});

router.get('/admin/party-inquiries', auth.staff, async (req, res) => {
  try {
    const inquiries = await PartyInquiry.find({}).sort({ createdAt: -1 });
    res.send(inquiries);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/admin/party-inquiries/:id', auth.staff, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['status'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const inquiry = await PartyInquiry.findById(req.params.id);
    if (!inquiry) return res.sendStatus(404);

    updates.forEach(update => (inquiry[update] = req.body[update]));
    await inquiry.save();
    res.send(inquiry);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/admin/party-inquiries/:id', auth.staff, async (req, res) => {
  try {
    const inquiry = await PartyInquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) return res.sendStatus(404);
    res.send(inquiry);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
