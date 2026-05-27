const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
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
