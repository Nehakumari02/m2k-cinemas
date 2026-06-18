const express = require('express');
const router = new express.Router();
const Setting = require('../models/setting');
const upload = require('../utils/multer');

// GET food page banners (public)
router.get('/food-banners', async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: 'foodPageBanners' });
    res.json({ banners: setting && Array.isArray(setting.value) ? setting.value : [] });
  } catch (e) {
    res.json({ banners: [] });
  }
});

// POST save food page banners (no auth required — admin page only)
router.post('/food-banners', async (req, res) => {
  try {
    const { banners } = req.body;
    let setting = await Setting.findOne({ key: 'foodPageBanners' });
    if (setting) {
      setting.value = banners;
      setting.markModified('value');
    } else {
      setting = new Setting({ key: 'foodPageBanners', value: banners });
    }
    await setting.save();
    res.json({ ok: true, count: banners.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST upload a single food banner image (no auth)
router.post('/food-banners/upload', upload('food').single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const url = `/uploads/food/${req.file.filename}`;
    res.json({ url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
