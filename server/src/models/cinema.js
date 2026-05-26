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
