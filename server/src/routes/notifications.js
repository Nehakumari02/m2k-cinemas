const express = require('express');
const auth = require('../middlewares/auth');
const PushSubscription = require('../models/pushSubscription');
const { getPublicKey, sendPushNotification } = require('../utils/push');

const router = new express.Router();

router.get('/notifications/vapid-public-key', (req, res) => {
  const publicKey = getPublicKey();
  if (!publicKey) {
    return res.status(503).send({
      error: { message: 'Push notifications are not configured on the server.' },
    });
  }
  return res.send({ publicKey });
});

router.post('/notifications/subscribe', async (req, res) => {
  try {
    const subscription = req.body?.subscription;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).send({ error: { message: 'Invalid push subscription.' } });
    }

    const update = {
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
      userAgent: String(req.headers['user-agent'] || '').slice(0, 500),
      active: true,
    };

    if (req.header('Authorization')) {
      try {
        const { user } = await auth.loadUserFromToken(req);
        if (user) update.user = user._id;
      } catch (e) {
        // Optional auth — ignore invalid tokens for public subscriptions
      }
    }

    const existing = await PushSubscription.findOne({ endpoint: subscription.endpoint });
    if (existing) {
      Object.assign(existing, update);
      await existing.save();
      return res.send({ message: 'Push subscription updated.', subscription: existing });
    }

    const created = new PushSubscription({
      endpoint: subscription.endpoint,
      ...update,
    });
    await created.save();
    return res.status(201).send({ message: 'Push subscription saved.', subscription: created });
  } catch (e) {
    return res.status(400).send({ error: { message: e.message || 'Subscription failed.' } });
  }
});

router.post('/notifications/unsubscribe', async (req, res) => {
  try {
    const endpoint = String(req.body?.endpoint || '').trim();
    if (!endpoint) {
      return res.status(400).send({ error: { message: 'Subscription endpoint is required.' } });
    }
    await PushSubscription.findOneAndUpdate({ endpoint }, { active: false });
    return res.send({ message: 'Push subscription removed.' });
  } catch (e) {
    return res.status(400).send({ error: { message: e.message || 'Unsubscribe failed.' } });
  }
});

router.get('/admin/push-subscribers', auth.staff, async (req, res) => {
  try {
    const subscribers = await PushSubscription.find({ active: true })
      .populate('user', 'name email username')
      .sort({ updatedAt: -1 });
    return res.send(subscribers);
  } catch (e) {
    return res.status(500).send({ error: { message: 'Failed to fetch push subscribers.' } });
  }
});

router.post('/admin/notifications/send', auth.staff, async (req, res) => {
  try {
    const title = String(req.body?.title || '').trim();
    const body = String(req.body?.body || '').trim();
    const url = String(req.body?.url || '/').trim() || '/';

    if (!title || !body) {
      return res.status(400).send({ error: { message: 'Title and message are required.' } });
    }

    const subscribers = await PushSubscription.find({ active: true });
    if (!subscribers.length) {
      return res.status(400).send({ error: { message: 'No active push subscribers found.' } });
    }

    const payload = {
      title,
      body,
      url,
      icon: 'https://m2kcinemas.com/Images/logo1.png',
    };

    let sent = 0;
    let failed = 0;
    const staleEndpoints = [];

    await Promise.all(
      subscribers.map(async sub => {
        try {
          await sendPushNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload
          );
          sent += 1;
        } catch (e) {
          failed += 1;
          if (e.statusCode === 404 || e.statusCode === 410) {
            staleEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    if (staleEndpoints.length) {
      await PushSubscription.updateMany(
        { endpoint: { $in: staleEndpoints } },
        { active: false }
      );
    }

    return res.send({
      message: `Notification sent to ${sent} subscriber${sent === 1 ? '' : 's'}.`,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (e) {
    return res.status(400).send({ error: { message: e.message || 'Failed to send notification.' } });
  }
});

module.exports = router;
