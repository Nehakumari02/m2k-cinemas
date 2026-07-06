const mongoose = require('mongoose');

const { Schema } = mongoose;

const partyInquirySchema = new Schema(
  {
    partyType: { type: String, enum: ['birthday', 'kitty'], required: true },
    partyName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    guestCount: { type: Number, required: true, min: 1 },
    ageGroup: { type: String, trim: true, default: '' },
    preferredDate: { type: Date },
    preferredMovie: { type: String, trim: true, default: '' },
    preferredCinema: { type: String, trim: true, default: '' },
    offerCode: { type: String, trim: true, uppercase: true, default: '' },
    message: { type: String, trim: true, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'confirmed', 'closed'],
      default: 'new',
    },
  },
  { timestamps: true }
);

const PartyInquiry = mongoose.model('PartyInquiry', partyInquirySchema);

module.exports = PartyInquiry;
