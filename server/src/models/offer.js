const mongoose = require('mongoose');

const { Schema } = mongoose;

const offerSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    validTill: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    discountPercentage: {
      type: Number,
      default: 10,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['standard', 'school_group'],
      default: 'standard',
    },
    minTickets: {
      type: Number,
      default: 0,
      min: 0,
    },
    inquiryOnly: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;
