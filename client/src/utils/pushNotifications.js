const PUSH_SW_PATH = `${process.env.PUBLIC_URL || ''}/push-sw.js`;
const SUBSCRIPTION_KEY = 'm2k_push_subscribed';

const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const getPushPermission = () => {
  if (!isPushSupported()) return 'unsupported';
  return Notification.permission;
};

export const isPushSubscribedLocally = () => localStorage.getItem(SUBSCRIPTION_KEY) === 'true';

export const registerPushServiceWorker = async () => {
  if (!isPushSupported()) return null;
  return navigator.serviceWorker.register(PUSH_SW_PATH);
};

export const getVapidPublicKey = async () => {
  const response = await fetch('/notifications/vapid-public-key');
  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Push notifications are not available right now.');
  }
  if (!response.ok) {
    throw new Error(data?.error?.message || 'Push notifications are not available right now.');
  }
  return data.publicKey;
};

export const subscribeToPushNotifications = async () => {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was denied.');
  }

  const registration = await registerPushServiceWorker();
  if (!registration) {
    throw new Error('Could not register push service worker.');
  }

  const publicKey = await getVapidPublicKey();
  let subscription = await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  const token = localStorage.getItem('jwtToken');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch('/notifications/subscribe', {
    method: 'POST',
    headers,
    body: JSON.stringify({ subscription }),
  });

  const text = await response.text();
  let data = {};
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('Failed to save push subscription.');
  }

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Failed to save push subscription.');
  }

  localStorage.setItem(SUBSCRIPTION_KEY, 'true');
  return data;
};

export const unsubscribeFromPushNotifications = async () => {
  if (!isPushSupported()) return;

  const registration = await navigator.serviceWorker.getRegistration(PUSH_SW_PATH);
  const subscription = registration ? await registration.pushManager.getSubscription() : null;

  if (subscription) {
    await fetch('/notifications/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    });
    await subscription.unsubscribe();
  }

  localStorage.removeItem(SUBSCRIPTION_KEY);
};
