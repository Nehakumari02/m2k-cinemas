const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err.message);
});

mongoose.connection.once('open', () => {
  console.log('MongoDB connected');
});
