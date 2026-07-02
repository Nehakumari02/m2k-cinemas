/* eslint-disable no-restricted-globals */

self.addEventListener('push', event => {
  let payload = {
    title: 'M2K Cinemas',
    body: 'You have a new update from M2K Cinemas.',
    url: '/',
    icon: 'https://m2kcinemas.com/Images/logo1.png',
  };

  if (event.data) {
    try {
      payload = { ...payload, ...event.data.json() };
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: payload.icon || 'https://m2kcinemas.com/Images/logo1.png',
    badge: 'https://m2kcinemas.com/Images/logo1.png',
    data: {
      url: payload.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(payload.title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const rawUrl = event.notification.data?.url || '/';

  const resolveTargetUrl = url => {
    if (!url) {
      return `${self.location.origin}${self.location.pathname}#/`;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    if (url.startsWith('/#/')) {
      return `${self.location.origin}${self.location.pathname}${url.slice(1)}`;
    }
    if (url.startsWith('/')) {
      return `${self.location.origin}${self.location.pathname}#${url}`;
    }
    return `${self.location.origin}${self.location.pathname}#/${url}`;
  };

  const targetUrl = resolveTargetUrl(rawUrl);

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (let i = 0; i < clientList.length; i += 1) {
        const client = clientList[i];
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
