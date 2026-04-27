const mongoose = require('mongoose');

const { Schema } = mongoose;

const experienceSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      default: [],
    },
    gradient: {
      type: String,
      required: true,
      trim: true,
    },
    accent: {
      type: String,
      default: '#b72429',
      trim: true,
    },
    icon: {
      type: String,
      default: '🎬',
      trim: true,
    },
    image: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;
