const mongoose = require('mongoose');

const { Schema } = mongoose;
const membershipSchema = new Schema({
  name: {
    type: String,
    required: true,
    enum: ['Silver', 'Gold', 'Platinum'],
  },
  price: {
    type: Number,
    required: true,
  },
  ticketDiscount: {
    type: Number,
    default: 0,
  },
  foodDiscount: {
    type: Number,
    default: 0,
  },
  benefits: [String],
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
