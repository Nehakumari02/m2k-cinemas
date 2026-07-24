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
  '/api/events',
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
    proxy((pathname, req) => {
      if (req.headers.accept && req.headers.accept.includes('text/html')) {
        return false; // Let React Router handle browser navigations
      }
      return API_PREFIXES.some(prefix => pathname.startsWith(prefix));
    }, {
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
};
