const webpush = require('web-push');

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || 'mailto:support@m2kcinemas.com';

let configured = false;

const configureWebPush = () => {
  if (configured) return true;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return false;
  }
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  configured = true;
  return true;
};

const getPublicKey = () => VAPID_PUBLIC_KEY;

const sendPushNotification = async (subscription, payload) => {
  if (!configureWebPush()) {
    throw new Error('Push notifications are not configured. Set VAPID keys in server/.env');
  }

  const body = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return webpush.sendNotification(subscription, body);
};

module.exports = {
  configureWebPush,
  getPublicKey,
  sendPushNotification,
};
