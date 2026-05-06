const express = require('express');
const auth = require('../middlewares/auth');
const Event = require('../models/event');
const upload = require('../utils/multer');

const router = new express.Router();

// Upload event image
router.post('/events/upload', auth.enhance, upload('events').single('image'), async (req, res) => {
  try {
    const url = `/uploads/events/${req.file.filename}`;

    res.send({ url });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Create event
router.post('/events', auth.enhance, async (req, res) => {
  const event = new Event(req.body);
  try {
    await event.save();
    res.status(201).send(event);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find({});
    res.send(events);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get event by id
router.get('/events/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const event = await Event.findById(_id);
    if (!event) return res.sendStatus(404);
    res.send(event);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update event
router.patch('/events/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['title', 'date', 'description', 'image'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const event = await Event.findById(_id);
    if (!event) return res.sendStatus(404);
    updates.forEach((update) => (event[update] = req.body[update]));
    await event.save();
    res.send(event);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete event
router.delete('/events/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const event = await Event.findByIdAndDelete(_id);
    if (!event) return res.sendStatus(404);
    res.send(event);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
