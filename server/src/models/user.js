const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;
const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('email is invalid');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes('password')) {
          throw new Error('Password should not contain word: password');
        }
      },
    },
    role: {
      type: String,
      default: 'guest',
      enum: ['guest', 'admin', 'superadmin'],
    },

    facebook: String,
    google: String,

    /** Temporary browse/book account without full registration */
    isSessionGuest: {
      type: Boolean,
      default: false,
    },
    guestSessionId: {
      type: String,
      sparse: true,
      unique: true,
    },

    phone: {
      type: String,
      trim: true,
      validate(value) {
        if (!value) return;
        if (!validator.isMobilePhone(value)) {
          throw new Error('Phone is invalid');
        }
      },
    },
    imageurl: {
      type: String,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    walletBalance: {
      type: Number,
      default: 0,
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    membership: {
      type: Schema.Types.ObjectId,
      ref: 'Membership',
    },
    membershipExpiresAt: {
      type: Date,
    },
    /** Set true after member uses the one-time first-booking GST benefit */
    membershipGstBenefitUsed: {
      type: Boolean,
      default: false,
    },
    wishlist: [{
      type: Schema.Types.ObjectId,
      ref: 'Movie'
    }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  if (!userObject.role === 'superadmin') {
    delete userObject.updatedAt;
    delete userObject.__v;
  }
  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

userSchema.methods.generateAuthToken = async function() {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, 'mySecret');
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.statics.findByCredentials = async (identifier, password) => {
  const normalizedIdentifier = String(identifier || '')
    .trim()
    .toLowerCase();
  const user = await User.findOne({
    $or: [{ username: normalizedIdentifier }, { email: normalizedIdentifier }],
  });
  if (!user) throw new Error('Unable to login');

  let isMatch = false;
  const providedPassword = String(password || '');

  // Support legacy users whose password might be stored as plain text.
  // On successful login, migrate immediately to a secure hash.
  if (typeof user.password === 'string' && user.password.startsWith('$2')) {
    isMatch = await bcrypt.compare(providedPassword, user.password);
  } else {
    isMatch = providedPassword === String(user.password || '');
    if (isMatch) {
      // Hash and save — but mark as already hashed so pre-save hook skips it
      user.password = await bcrypt.hash(providedPassword, 8);
      user._skipPasswordHash = true;
      await user.save();
    }
  }
  if (!isMatch) throw new Error('Unable to login');

  return user;
};

// Only index real phone numbers (multiple guests/users may omit phone)
userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $type: 'string', $gt: '' },
    },
  }
);

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.phone == null || String(user.phone).trim() === '') {
    user.phone = undefined;
  }
  if (user.isModified('password') && !user._skipPasswordHash) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  user._skipPasswordHash = false;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
