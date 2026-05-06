const express = require('express');
const auth = require('../middlewares/auth');
const upload = require('../utils/multer');
const Experience = require('../models/experience');

const router = new express.Router();

router.get('/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find({ isActive: true }).sort({ createdAt: -1 });
    res.send(experiences);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get('/admin/experiences', auth.enhance, async (req, res) => {
  try {
    const experiences = await Experience.find({}).sort({ createdAt: -1 });
    res.send(experiences);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/experiences', auth.enhance, async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    res.status(201).send(experience);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post(
  '/experiences/photo/:id',
  auth.enhance,
  upload('experiences').single('file'),
  async (req, res, next) => {
    const { file } = req;
    const experienceId = req.params.id;
    try {
      if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
      }
      const experience = await Experience.findById(experienceId);
      if (!experience) return res.sendStatus(404);
      experience.image = `/${file.path}`;
      await experience.save();
      return res.send({ experience, file });
    } catch (e) {
      return res.sendStatus(400);
    }
  }
);

router.put('/experiences/:id', auth.enhance, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = [
    'key',
    'title',
    'subtitle',
    'description',
    'features',
    'gradient',
    'accent',
    'icon',
    'image',
    'isActive',
  ];
  const isValidOperation = updates.every((u) => allowedUpdates.includes(u));
  if (!isValidOperation) return res.status(400).send({ error: 'Invalid updates!' });

  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.sendStatus(404);
    updates.forEach((u) => (experience[u] = req.body[u]));
    await experience.save();
    res.send(experience);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/experiences/:id', auth.enhance, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    if (!experience) return res.sendStatus(404);
    res.send(experience);
  } catch (e) {
    res.sendStatus(400);
  }
});

module.exports = router;
