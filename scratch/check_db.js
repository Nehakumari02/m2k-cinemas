const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const movieSchema = new mongoose.Schema({
  title: String
});
const Movie = mongoose.model('Movie', movieSchema);

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-app', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    const count = await Movie.countDocuments({});
    console.log('Total movies:', count);
    const movies = await Movie.find({});
    console.log('Movies titles:', movies.map(m => m.title));
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

check();
