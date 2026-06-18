const express = require('express');
const router = express.Router();
const transporter = require('../utils/mail');
const Feedback = require('../models/feedback');
const { staff } = require('../middlewares/auth');

// Public: Submit feedback (saves to DB + sends email)
router.post('/feedback', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Feedback message is required' });
    }

    // Save to database
    const feedback = new Feedback({ name: name || 'Anonymous', email: email || '', message });
    await feedback.save();

    // Send email notification to M2K
    try {
      const toEmail = process.env.M2K_CONTACT_EMAIL || process.env.GMAIL_USER;
      if (toEmail) {
        await transporter.sendEMail({
          from: process.env.GMAIL_USER,
          to: toEmail,
          subject: `New Customer Feedback from ${name || 'Anonymous'}`,
          text: `You have received new feedback.\n\nName: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\n\nFeedback Message:\n${message}`,
        });
      }
    } catch (mailErr) {
      console.warn('Email notification failed (feedback still saved):', mailErr.message);
    }

    res.status(200).json({ success: true, message: 'Feedback sent successfully' });
  } catch (error) {
    console.error('Error saving feedback:', error);
    res.status(500).json({ error: 'Failed to save feedback' });
  }
});

// Admin: Get all feedback
router.get('/admin/feedbacks', staff, async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Admin: Update feedback status
router.patch('/admin/feedbacks/:id', staff, async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ error: 'Feedback not found' });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Admin: Delete feedback
router.delete('/admin/feedbacks/:id', staff, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

module.exports = router;
