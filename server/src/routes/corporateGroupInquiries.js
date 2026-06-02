const express = require('express');
const auth = require('../middlewares/auth');
const CorporateGroupInquiry = require('../models/corporateGroupInquiry');

const router = new express.Router();

router.post('/corporate-group-inquiries', async (req, res) => {
  try {
    const {
      companyName,
      contactName,
      email,
      phone,
      employeeCount,
      department,
      preferredDate,
      preferredMovie,
      preferredCinema,
      offerCode,
      message,
    } = req.body;

    if (!companyName || !contactName || !email || !phone || !employeeCount) {
      return res.status(400).send({
        error: { message: 'Company name, contact name, email, phone, and employee count are required.' },
      });
    }

    const inquiry = new CorporateGroupInquiry({
      companyName,
      contactName,
      email,
      phone,
      employeeCount: Number(employeeCount),
      department,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      preferredMovie,
      preferredCinema,
      offerCode,
      message,
    });

    await inquiry.save();
    res.status(201).send({ inquiry, message: 'Your corporate group booking enquiry was submitted successfully.' });
  } catch (e) {
    console.error('Corporate group inquiry error:', e);
    res.status(400).send({
      error: { message: 'Could not submit enquiry. Please check your details and try again.' },
    });
  }
});

router.get('/admin/corporate-group-inquiries', auth.staff, async (req, res) => {
  try {
    const inquiries = await CorporateGroupInquiry.find({}).sort({ createdAt: -1 });
    res.send(inquiries);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/admin/corporate-group-inquiries/:id', auth.staff, async (req, res) => {
  const allowed = ['status'];
  const updates = Object.keys(req.body);
  if (!updates.every(u => allowed.includes(u))) {
    return res.status(400).send({ error: { message: 'Invalid update fields' } });
  }

  try {
    const inquiry = await CorporateGroupInquiry.findById(req.params.id);
    if (!inquiry) return res.sendStatus(404);

    if (req.body.status) inquiry.status = req.body.status;
    await inquiry.save();
    res.send(inquiry);
  } catch (e) {
    res.status(400).send({ error: { message: 'Could not update enquiry' } });
  }
});

module.exports = router;
