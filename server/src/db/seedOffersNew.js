const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });
const Offer = require('../models/offer');

require('./mongoose');

const seedOffers = async () => {
  try {
    const offers = [
      {
        title: 'Ultimate Cinema Experience',
        description: 'Get unbeatable deals on your favorite movie tickets. Limited time offer!',
        code: 'MOVIE25',
        validTill: new Date('2026-12-31'),
        image: 'uploads/offers/cinema_offer.png',
        discountPercentage: 25,
        isActive: true
      },
      {
        title: 'Unmissable Movie Deals',
        description: 'Massive discounts & up to 70% off on select movies. Book now!',
        code: 'DEAL70',
        validTill: new Date('2026-12-31'),
        image: 'uploads/offers/shopping_offer.png',
        discountPercentage: 70,
        isActive: true
      }
    ];

    for (const offer of offers) {
      await Offer.findOneAndUpdate({ title: offer.title }, offer, { upsert: true });
      console.log(`Updated offer: ${offer.title}`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding offers:', error);
    process.exit(1);
  }
};

seedOffers();
