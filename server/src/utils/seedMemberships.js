const mongoose = require('mongoose');
const Membership = require('../models/membership');

async function seedMemberships() {
  await mongoose.connect('mongodb://127.0.0.1:27017/pvrcinemas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const plans = [
    {
      name: 'Silver',
      price: 499,
      ticketDiscount: 0,
      foodDiscount: 5,
      benefits: ['5% discount on all food items', 'Standard booking'],
    },
    {
      name: 'Gold',
      price: 999,
      ticketDiscount: 10,
      foodDiscount: 10,
      benefits: ['10% discount on tickets', '10% discount on food', 'Priority booking'],
    },
    {
      name: 'Platinum',
      price: 1999,
      ticketDiscount: 20,
      foodDiscount: 20,
      benefits: [
        '20% discount on tickets',
        '20% discount on food',
        'Early access to bookings',
        'VIP Lounge access',
      ],
    },
  ];

  await Membership.deleteMany({});
  await Membership.insertMany(plans);

  console.log('Membership plans seeded!');
  mongoose.disconnect();
}

seedMemberships();
