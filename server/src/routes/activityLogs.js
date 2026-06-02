const express = require('express');
const auth = require('../middlewares/auth');
const ActivityLog = require('../models/activityLog');

const router = new express.Router();

router.get('/admin/activity-logs', auth.enhance, async (req, res) => {
  try {
    const { entityType, entityId, action, limit = 200 } = req.query;
    const query = {};
    if (entityType) query.entityType = String(entityType);
    if (entityId) query.entityId = String(entityId);
    if (action) query.action = String(action);
    const cappedLimit = Math.max(1, Math.min(Number(limit) || 200, 500));
    const logs = await ActivityLog.find(query).sort({ createdAt: -1 }).limit(cappedLimit);
    return res.send(logs);
  } catch (e) {
    return res.status(500).send({ error: { message: 'Failed to fetch activity logs' } });
  }
});

module.exports = router;

