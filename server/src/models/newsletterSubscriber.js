const mongoose = require('mongoose');

const { Schema } = mongoose;

const newsletterSubscriberSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      default: 'footer_newsletter',
      trim: true,
    },
    status: {
      type: String,
      enum: ['subscribed', 'unsubscribed'],
      default: 'subscribed',
    },
    consentTextVersion: {
      type: String,
      default: 'v1',
    },
    consentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

newsletterSubscriberSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email: { $exists: true, $type: 'string', $gt: '' },
    },
  }
);

newsletterSubscriberSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $type: 'string', $gt: '' },
    },
  }
);

const NewsletterSubscriber = mongoose.model(
  'NewsletterSubscriber',
  newsletterSubscriberSchema
);

module.exports = NewsletterSubscriber;

