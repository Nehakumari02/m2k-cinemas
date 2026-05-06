const fetch = require('node-fetch');

async function test() {
  const token = 'YOUR_TOKEN_HERE'; // I need to get a token
  const data = {
    date: new Date(),
    startAt: '10:00 AM',
    seats: [[0, 0]],
    ticketPrice: 100,
    total: 100,
    movieId: '60d5f50c2f8fb814b4f25311', // Dummy ID
    cinemaId: '60d5f50c2f8fb814b4f25312', // Dummy ID
    username: 'testuser',
    phone: '1234567890',
    status: 'Pending'
  };

  try {
    const response = await fetch('http://localhost:8080/reservations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // 'Authorization': `Bearer ${token}` // I'll skip auth for now if possible or use a real token
      },
      body: JSON.stringify(data)
    });
    const result = await response.json();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

test();
