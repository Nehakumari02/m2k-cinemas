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

    phone: {
      type: String,
      unique: true,
      trim: true,
      validate(value) {
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

// Hash the plain text password before save
userSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password') && !user._skipPasswordHash) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  user._skipPasswordHash = false;
  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
