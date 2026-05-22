const express = require('express');
const auth = require('../middlewares/auth');
const SchoolGroupInquiry = require('../models/schoolGroupInquiry');

const router = new express.Router();

router.post('/school-group-inquiries', async (req, res) => {
  try {
    const {
      schoolName,
      contactName,
      email,
      phone,
      studentCount,
      gradeOrClass,
      preferredDate,
      preferredMovie,
      preferredCinema,
      offerCode,
      message,
    } = req.body;

    if (!schoolName || !contactName || !email || !phone || !studentCount) {
      return res.status(400).send({
        error: { message: 'School name, contact name, email, phone, and student count are required.' },
      });
    }

    const inquiry = new SchoolGroupInquiry({
      schoolName,
      contactName,
      email,
      phone,
      studentCount: Number(studentCount),
      gradeOrClass,
      preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      preferredMovie,
      preferredCinema,
      offerCode,
      message,
    });

    await inquiry.save();
    res.status(201).send({ inquiry, message: 'Your school group booking enquiry was submitted successfully.' });
  } catch (e) {
    console.error('School group inquiry error:', e);
    res.status(400).send({
      error: { message: 'Could not submit enquiry. Please check your details and try again.' },
    });
  }
});

router.get('/admin/school-group-inquiries', auth.staff, async (req, res) => {
  try {
    const inquiries = await SchoolGroupInquiry.find({}).sort({ createdAt: -1 });
    res.send(inquiries);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch('/admin/school-group-inquiries/:id', auth.staff, async (req, res) => {
  const allowed = ['status'];
  const updates = Object.keys(req.body);
  if (!updates.every(u => allowed.includes(u))) {
    return res.status(400).send({ error: { message: 'Invalid update fields' } });
  }

  try {
    const inquiry = await SchoolGroupInquiry.findById(req.params.id);
    if (!inquiry) return res.sendStatus(404);

    if (req.body.status) inquiry.status = req.body.status;
    await inquiry.save();
    res.send(inquiry);
  } catch (e) {
    res.status(400).send({ error: { message: 'Could not update enquiry' } });
  }
});

module.exports = router;
