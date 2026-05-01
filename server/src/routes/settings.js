const express = require('express');
const router = new express.Router();
const auth = require('../middlewares/auth');
const Setting = require('../models/setting');

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
router.post('/settings', auth.enhance, async (req, res) => {
  const { key, value } = req.body;
  try {
    let setting = await Setting.findOne({ key });
    if (setting) {
      setting.value = value;
    } else {
      setting = new Setting({ key, value });
    }
    await setting.save();
    res.send(setting);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
