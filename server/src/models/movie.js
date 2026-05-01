const mongoose = require('mongoose');

const { Schema } = mongoose;
const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  image: {
    type: String,
  },
  backdropImages: [
    {
      type: String,
      trim: true,
    },
  ],
  castCrew: [
    {
      name: {
        type: String,
        trim: true,
      },
      role: {
        type: String,
        trim: true,
      },
      image: {
        type: String,
        trim: true,
      },
    },
  ],
  language: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  genre: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  director: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  cast: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  synopsis: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    required: false,
    default: 0,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
