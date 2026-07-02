const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://m2k-cinemas:Cinemas123@cluster0.qwtyea6.mongodb.net/pvrcinemas?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.once('open', async () => {
  console.log('MongoDB connected');
  try {
    const User = require('../models/user');
    const { modifiedCount } = await User.updateMany(
      { $or: [{ phone: null }, { phone: '' }] },
      { $unset: { phone: 1 } }
    );
    if (modifiedCount) {
      console.log(`Unset empty phone on ${modifiedCount} user(s)`);
    }
    await User.syncIndexes();
  } catch (err) {
    console.warn('User phone index maintenance:', err.message);
  }
});
