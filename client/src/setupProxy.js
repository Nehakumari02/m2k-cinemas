const proxy = require('http-proxy-middleware');

const API_PREFIXES = [
  '/users',
  '/movies',
  '/cinemas',
  '/showtimes',
  '/reservations',
  '/invitations',
  '/payments',
  '/offers',
  '/experiences',
  '/food',
  '/events',
  '/wallet',
  '/products',
  '/orders',
  '/food-orders',
  '/settings',
  '/refunds',
  '/school-group-inquiries',
  '/uploads',
  '/admin',
  '/memberships',
  '/newsletter',
];

module.exports = function setupProxy(app) {
  app.use(
    proxy((pathname) => API_PREFIXES.some(prefix => pathname.startsWith(prefix)), {
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
