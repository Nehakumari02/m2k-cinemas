const mongoose = require('mongoose');

const { Schema } = mongoose;

const refundSchema = new Schema(
  {
    originalId: {
      type: Schema.Types.ObjectId,
      required: true,
      // This will point to either a Reservation or an Order
    },
    type: {
      type: String,
      enum: ['Reservation', 'Order'],
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reason: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Refund = mongoose.model('Refund', refundSchema);

module.exports = Refund;
