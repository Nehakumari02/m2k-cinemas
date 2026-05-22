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
  /** GST % shown on movie tickets (default 18%) */
  ticketGstPercent: {
    type: Number,
    default: 18,
  },
  /** One-time extra % off ticket value on member's first booking */
  firstBookingGstBenefitPercent: {
    type: Number,
    default: 5,
  },
  benefits: [String],
}, { timestamps: true });

const Membership = mongoose.model('Membership', membershipSchema);

module.exports = Membership;
