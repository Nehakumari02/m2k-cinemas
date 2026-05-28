const express = require('express');
const auth = require('../middlewares/auth');
const NewsletterSubscriber = require('../models/newsletterSubscriber');

const router = new express.Router();

router.post('/newsletter/subscribe', async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    const phone = String(req.body?.phone || '').replace(/\D/g, '');
    const source = String(req.body?.source || 'footer_newsletter').trim();

    if (!email && !phone) {
      return res.status(400).send({ error: { message: 'Please enter email or mobile number.' } });
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).send({ error: { message: 'Please enter a valid email address.' } });
    }

    if (phone && phone.length < 10) {
      return res.status(400).send({ error: { message: 'Please enter a valid 10-digit mobile number.' } });
    }

    let subscriber =
      (email && (await NewsletterSubscriber.findOne({ email }))) ||
      (phone && (await NewsletterSubscriber.findOne({ phone })));

    if (subscriber) {
      subscriber.email = email || subscriber.email;
      subscriber.phone = phone || subscriber.phone;
      subscriber.status = 'subscribed';
      subscriber.source = source || subscriber.source;
      subscriber.consentAt = new Date();
      await subscriber.save();
    } else {
      subscriber = new NewsletterSubscriber({
        email: email || undefined,
        phone: phone || undefined,
        source,
        status: 'subscribed',
      });
      await subscriber.save();
    }

    return res.send({
      message: 'Thank you for subscribing to our newsletter!',
      subscriber,
    });
  } catch (e) {
    return res.status(400).send({ error: { message: e.message || 'Subscription failed' } });
  }
});

router.get('/admin/newsletter-subscribers', auth.enhance, async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find({}).sort({ createdAt: -1 });
    return res.send(subscribers);
  } catch (e) {
    return res.status(500).send({ error: { message: 'Failed to fetch subscribers' } });
  }
});

router.patch('/admin/newsletter-subscribers/:id', auth.enhance, async (req, res) => {
  try {
    const status = String(req.body?.status || '').trim();
    if (!['subscribed', 'unsubscribed'].includes(status)) {
      return res.status(400).send({ error: { message: 'Invalid status' } });
    }
    const subscriber = await NewsletterSubscriber.findById(req.params.id);
    if (!subscriber) return res.sendStatus(404);
    subscriber.status = status;
    await subscriber.save();
    return res.send(subscriber);
  } catch (e) {
    return res.status(400).send({ error: { message: e.message || 'Update failed' } });
  }
});

module.exports = router;

