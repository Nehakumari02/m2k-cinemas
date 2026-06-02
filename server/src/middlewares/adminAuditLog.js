const { writeActivityLog } = require('../utils/activityLog');

const MUTATION_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

const SENSITIVE_KEYS = new Set(['password', 'tokens', 'token', 'otp', 'secret']);

function sanitizeObject(value) {
  if (!value || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(sanitizeObject);
  return Object.keys(value).reduce((acc, key) => {
    if (SENSITIVE_KEYS.has(String(key).toLowerCase())) {
      acc[key] = '[REDACTED]';
      return acc;
    }
    const current = value[key];
    if (current && typeof current === 'object') {
      acc[key] = sanitizeObject(current);
    } else {
      acc[key] = current;
    }
    return acc;
  }, {});
}

module.exports = function adminAuditLog(req, res, next) {
  res.on('finish', async () => {
    try {
      if (!MUTATION_METHODS.has(req.method)) return;
      if (res.statusCode >= 400) return;
      if (!req.user || !['superadmin', 'admin'].includes(req.user.role)) return;
      if (req.originalUrl.startsWith('/admin/activity-logs')) return;

      const body = req.body && typeof req.body === 'object' ? req.body : {};
      const changedFields = Object.keys(body);

      const meta = {
        method: req.method,
        endpoint: req.originalUrl,
        changedFields,
        payload: sanitizeObject(body),
      };

      if (req.params && Object.keys(req.params).length) {
        meta.params = req.params;
      }
      if (req.file) {
        meta.file = {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
        };
      }

      await writeActivityLog(req, {
        action: 'admin.panel_change',
        entityType: 'admin_action',
        entityId: req.params?.id ? String(req.params.id) : undefined,
        meta,
      });
    } catch (e) {
      // non-blocking audit trail
      console.warn('Admin audit log failed:', e.message);
    }
  });

  next();
};

