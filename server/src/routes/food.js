const express = require('express');
const auth = require('../middlewares/auth');
const Food = require('../models/food');
const upload = require('../utils/multer');

const router = new express.Router();

// Upload food image
router.post('/food/upload', auth.enhance, upload('food').single('image'), async (req, res) => {
  try {
    const url = `${req.protocol}://${req.get('host')}/uploads/food/${req.file.filename}`;
    res.send({ url });
  } catch (e) {
    res.status(400).send(e);
  }
});

// Create food
router.post('/food', auth.enhance, async (req, res) => {
  const food = new Food(req.body);
  try {
    await food.save();
    res.status(201).send(food);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get all food
router.get('/food', async (req, res) => {
  try {
    const food = await Food.find({});
    res.send(food);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Get food by id
router.get('/food/:id', async (req, res) => {
  const _id = req.params.id;
  try {
    const food = await Food.findById(_id);
    if (!food) return res.sendStatus(404);
    res.send(food);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Update food
router.patch('/food/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'category', 'description', 'price', 'image', 'type', 'isWeeklyOffer', 'isMonthlyOffer'];
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const food = await Food.findById(_id);
    if (!food) return res.sendStatus(404);
    updates.forEach((update) => (food[update] = req.body[update]));
    await food.save();
    res.send(food);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Delete food
router.delete('/food/:id', auth.enhance, async (req, res) => {
  const _id = req.params.id;
  try {
    const food = await Food.findByIdAndDelete(_id);
    if (!food) return res.sendStatus(404);
    res.send(food);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
