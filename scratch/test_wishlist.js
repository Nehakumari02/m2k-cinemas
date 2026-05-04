const http = require('http');

const req = http.request({
  hostname: 'localhost',
  port: 8080,
  path: '/users/me/wishlist',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer DUMMY'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', res.statusCode, data));
});
req.on('error', console.error);
req.write(JSON.stringify({ movieId: '662b2b1a1c4b8b4b4c123456' }));
req.end();
