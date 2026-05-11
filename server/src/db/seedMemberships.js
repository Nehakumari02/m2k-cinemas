const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Membership = require('../models/membership');

const memberships = [
  {
    name: 'Silver',
    price: 499,
    ticketDiscount: 10,
    foodDiscount: 5,
    benefits: ['10% off on all movie tickets', '5% off on food and beverages', 'Valid for 1 year']
  },
  {
    name: 'Gold',
    price: 999,
    ticketDiscount: 20,
    foodDiscount: 15,
    benefits: ['20% off on all movie tickets', '15% off on food and beverages', 'Priority booking access', 'Valid for 1 year']
  },
  {
    name: 'Platinum',
    price: 1999,
    ticketDiscount: 35,
    foodDiscount: 25,
    benefits: ['35% off on all movie tickets', '25% off on food and beverages', 'Free popcorn on every 5th visit', 'Priority booking access', 'Valid for 1 year']
  }
];

const seedMemberships = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/pvrcinemas', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    
    await Membership.deleteMany();
    await Membership.insertMany(memberships);
    
    console.log('Memberships seeded successfully!');
    process.exit();
  } catch (e) {
    console.error('Error seeding memberships:', e);
    process.exit(1);
  }
};

seedMemberships();
