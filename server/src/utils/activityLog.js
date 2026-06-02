const ActivityLog = require('../models/activityLog');

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = String(forwarded).split(',')[0].trim();
    if (first) return first;
  }
  return req.ip || req.connection?.remoteAddress || '';
}

async function writeActivityLog(req, payload) {
  try {
    const user = req.user || null;
    await ActivityLog.create({
      ...payload,
      actorId: user ? user._id : undefined,
      actorName: user ? user.name : 'Public User',
      actorRole: user ? user.role : 'public',
      ip: getClientIp(req),
      userAgent: req.get('user-agent') || '',
    });
  } catch (e) {
    // best-effort logging: never break main flow
    console.warn('Activity log write failed:', e.message);
  }
}

module.exports = { writeActivityLog, getClientIp };

