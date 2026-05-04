const mongoose = require('mongoose');

const { Schema } = mongoose;

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['veg', 'non-veg'],
    default: 'veg'
  },
  isWeeklyOffer: {
    type: Boolean,
    default: false
  },
  isMonthlyOffer: {
    type: Boolean,
    default: false
  }
});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;
