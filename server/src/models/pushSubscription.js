const mongoose = require('mongoose');

const { Schema } = mongoose;

const pushSubscriptionSchema = Schema(
  {
    endpoint: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    userAgent: String,
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PushSubscription = mongoose.model('PushSubscription', pushSubscriptionSchema);

module.exports = PushSubscription;
