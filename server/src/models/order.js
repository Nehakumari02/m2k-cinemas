const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: String,
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refund Requested', 'Refunded'],
      default: 'Pending',
    },
    shippingAddress: {
      fullName: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
    paymentMethod: {
      type: String,
      enum: ['Wallet', 'Card', 'UPI', 'NetBanking'],
      required: true,
    },
    trackingId: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
