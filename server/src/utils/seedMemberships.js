const mongoose = require('mongoose');
const Membership = require('../models/membership');

async function seedMemberships() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pvrcinemas', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const plans = [
    {
      name: 'Silver',
      price: 499,
      ticketDiscount: 10,
      foodDiscount: 5,
      ticketGstPercent: 18,
      firstBookingGstBenefitPercent: 5,
      benefits: [
        '18% GST on movie tickets (shown transparently at checkout)',
        'First booking: extra 5% off on ticket value',
        '10% off on all movie tickets',
        '5% off on food and beverages',
        'Valid for 1 year',
      ],
    },
    {
      name: 'Gold',
      price: 999,
      ticketDiscount: 20,
      foodDiscount: 15,
      ticketGstPercent: 18,
      firstBookingGstBenefitPercent: 5,
      benefits: [
        '18% GST on movie tickets (shown transparently at checkout)',
        'First booking: extra 5% off on ticket value',
        '20% off on all movie tickets',
        '15% off on food and beverages',
        'Priority booking access',
        'Valid for 1 year',
      ],
    },
    {
      name: 'Platinum',
      price: 1999,
      ticketDiscount: 35,
      foodDiscount: 25,
      ticketGstPercent: 18,
      firstBookingGstBenefitPercent: 5,
      benefits: [
        '18% GST on movie tickets (shown transparently at checkout)',
        'First booking: extra 5% off on ticket value',
        '35% off on all movie tickets',
        '25% off on food and beverages',
        'Free popcorn on every 5th visit',
        'Priority booking access',
        'Valid for 1 year',
      ],
    },
  ];

  await Membership.deleteMany({});
  await Membership.insertMany(plans);

  console.log('Membership plans seeded!');
  mongoose.disconnect();
}

seedMemberships();
