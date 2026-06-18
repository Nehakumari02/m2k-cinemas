const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Anonymous' },
    email: { type: String, default: '' },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'resolved'], default: 'new' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
