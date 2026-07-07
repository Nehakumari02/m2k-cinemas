const express = require('express');
const Movie = require('../models/movie');
const Food = require('../models/food');
const Cinema = require('../models/cinema');
const Offer = require('../models/offer');

const router = new express.Router();

router.post('/chatbot', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).send({ error: 'Message is required' });
    }

    const query = message.toLowerCase();
    
    // 1. Movie matching
    if (query.includes('movie') || query.includes('playing') || query.includes('film') || query.includes('showtime') || query.includes('show')) {
      const movies = await Movie.find().limit(5);
      if (movies.length > 0) {
        const titles = movies.map(m => m.title).join(', ');
        return res.send({
          text: `We have some great movies playing right now, including: ${titles}.`,
          options: ['Showtimes', 'Food & Beverages'],
          actionRoute: '/movies'
        });
      }
    }
    
    // 2. Specific Movie search (very basic)
    const allMovies = await Movie.find();
    const movieMatch = allMovies.find(m => query.includes(m.title.toLowerCase()));
    if (movieMatch) {
       return res.send({
          text: `Yes, ${movieMatch.title} is available! Directed by ${movieMatch.director}.`,
          options: ['Showtimes', 'Book Tickets'],
          actionRoute: `/movie/${movieMatch._id}`
        });
    }

    // 3. Food matching
    if (query.includes('food') || query.includes('popcorn') || query.includes('drink') || query.includes('hungry') || query.includes('beverage')) {
      const food = await Food.find().limit(5);
      if (food.length > 0) {
        const foodNames = food.map(f => `${f.name} (₹${f.price})`).join(', ');
        return res.send({
          text: `We offer a variety of delicious snacks! Some popular items are: ${foodNames}.`,
          options: ['Showtimes', 'Offers'],
          actionRoute: '/food-combos'
        });
      }
    }

    // 4. Cinema / Location
    if (query.includes('cinema') || query.includes('location') || query.includes('where')) {
      const cinemas = await Cinema.find().limit(3);
      if (cinemas.length > 0) {
        const cinemaNames = cinemas.map(c => `${c.name} in ${c.city}`).join(', ');
        return res.send({
          text: `Our premium cinemas include: ${cinemaNames}.`,
          options: ['Movies', 'Showtimes'],
          actionRoute: '/cinemas'
        });
      }
    }

    // 5. Offers
    if (query.includes('offer') || query.includes('discount') || query.includes('deal')) {
      const offers = await Offer.find().limit(3);
      if (offers.length > 0) {
        const offerNames = offers.map(o => `${o.title} (${o.discountPercentage}% off)`).join(', ');
        return res.send({
          text: `We have great deals like: ${offerNames}.`,
          options: ['Movies', 'Food & Beverages'],
          actionRoute: '/offers'
        });
      }
    }
    
    // 6. Group Booking
    if (query.includes('group') || query.includes('party') || query.includes('school') || query.includes('corporate')) {
      return res.send({
        text: 'Planning a group event? We cater to school, corporate, birthday, and kitty parties.',
        options: ['Movies', 'Contact Support'],
        actionRoute: '/group-booking'
      });
    }

    // 7. Contact Support
    if (query.includes('contact') || query.includes('support') || query.includes('help')) {
      return res.send({
        text: 'Need human assistance? Visit our contact page.',
        options: ['Movies', 'Group Booking'],
        actionRoute: '/contact-us'
      });
    }

    // Fallback
    res.send({
      text: "I'm sorry, I couldn't find specific information for that. You can ask me about movies, showtimes, food, offers, or group bookings!",
      options: ['Movies', 'Food & Beverages', 'Offers', 'Group Booking']
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).send({ error: 'An error occurred while processing your request.' });
  }
});

module.exports = router;
