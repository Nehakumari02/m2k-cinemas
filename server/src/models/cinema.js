const mongoose = require('mongoose');

const { Schema } = mongoose;

const cinemaSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  /** Extra ₹ added to the movie base price for premium/special seats (not the full seat price). */
  specialPrice: {
    type: Number,
    required: false,
    default: 0,
  },
  city: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  /** Venue display label (e.g. M2K Cinemas Rohini). */
  venueLabel: {
    type: String,
    trim: true,
  },
  /** Full street address for this cinema location. */
  address: {
    type: String,
    trim: true,
  },
  legalName: {
    type: String,
    trim: true,
  },
  registeredAddress: {
    type: String,
    trim: true,
  },
  seats: {
    type: [Schema.Types.Mixed],
    required: true,
  },
  /** Optional per-row labels (e.g. skip row I, mark WAY walkway). */
  rowLabels: {
    type: [String],
    default: undefined,
  },
  /** Dedicated seat-map renderer (e.g. m2k-pitampura). */
  layoutKey: {
    type: String,
    trim: true,
    default: undefined,
  },
  /** Venue-specific seat labels (e.g. rohini block numbering). */
  seatNumbering: {
    type: String,
    trim: true,
    default: undefined,
  },
  /** Fixed column count for aligned layouts (e.g. Pitampura = 19). */
  gridWidth: {
    type: Number,
    default: undefined,
  },
  /** When false, do not render a synthetic center aisle in the seat map. */
  centerAisle: {
    type: Boolean,
    default: true,
  },
  /** When false, hide from public cinemas browse (screens still bookable via showtimes). */
  showOnCinemasPage: {
    type: Boolean,
    default: true,
  },
  seatsAvailable: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});

const Cinema = mongoose.model('Cinema', cinemaSchema);

module.exports = Cinema;
