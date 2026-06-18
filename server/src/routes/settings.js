const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Setting = require('../models/setting');
const upload = require('../utils/multer');

// GET all settings
router.get('/settings', async (req, res) => {
  try {
    const settings = await Setting.find({});
    res.send(settings);
  } catch (e) {
    res.status(500).send();
  }
});

// GET specific setting by key
router.get('/settings/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });
    if (!setting) return res.status(404).send();
    res.send(setting);
  } catch (e) {
    res.status(500).send();
  }
});

// UPDATE or CREATE setting (Admin only)
router.post('/settings', auth.staff, async (req, res) => {
  const { key, value } = req.body;
  try {
    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
      setting.markModified('value');
    } else {
      setting = new Setting({ key, value });
    }
    await setting.save();
    res.send(setting);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Upload home page banner image (Admin only)
router.post(
  '/settings/home-banner/upload',
  auth.staff,
  upload('settings').single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send({ error: { message: 'Please upload an image file' } });
      }

      const imageUrl = `/${req.file.path}`;
      let setting = await Setting.findOne({ key: 'homePageBanner' });
      const existingValue =
        setting && setting.value && typeof setting.value === 'object' ? setting.value : {};
      const value = { ...existingValue, imageUrl };

      if (setting) {
        setting.value = value;
      } else {
        setting = new Setting({ key: 'homePageBanner', value });
      }
      await setting.save();
      return res.send({ imageUrl, setting });
    } catch (e) {
      return res.status(400).send({ error: { message: e.message || 'Failed to upload banner image' } });
    }
  }
);

module.exports = router;
