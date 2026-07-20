const mongoose = require('mongoose');

const { Schema } = mongoose;

const foodOrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        food: {
          type: Schema.Types.ObjectId,
          ref: 'Food',
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
    discountAmount: {
      type: Number,
      default: 0,
    },
    couponCode: {
      type: String,
      default: '',
    },
    pointsUsed: {
      type: Number,
      default: 0,
    },
    pickupDetails: {
      fullName: String,
      phone: String,
      pickupTime: String,
      notes: String,
      location: {
        type: String,
        default: 'M2K Concession Counter',
      },
    },
    paymentMethod: {
      type: String,
      enum: ['Wallet', 'Card', 'UPI', 'NetBanking', 'icici'],
      required: true,
    },
    paymentId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['PENDING_PAYMENT', 'Pending', 'Preparing', 'Ready', 'Collected', 'Cancelled'],
      default: 'Pending',
    },
    orderNumber: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

foodOrderSchema.pre('save', function generateOrderNumber(next) {
  if (!this.orderNumber) {
    this.orderNumber = `FD${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

const FoodOrder = mongoose.model('FoodOrder', foodOrderSchema);

module.exports = FoodOrder;
