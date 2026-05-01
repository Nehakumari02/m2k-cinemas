const http = require('http');

const data = JSON.stringify({
  name: 'Classic Popcorn',
  category: 'Popcorn',
  description: 'Freshly popped buttery corn.',
  price: 150,
  image: 'https://images.unsplash.com/photo-1572177191856-3cde618dee1f?auto=format&fit=crop&q=80&w=500',
  type: 'veg'
});

const options = {
  hostname: 'localhost',
  port: 8080,
  path: '/food',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (error) => {
  console.error(error);
});

req.write(data);
req.end();
