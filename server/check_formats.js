const mongoose = require('mongoose');
const Movie = require('./src/models/movie');

mongoose.connect('mongodb://localhost:27017/pvrcinemas', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const movies = await Movie.find({});
    console.log(`Found ${movies.length} movies.`);
    movies.forEach(m => {
      console.log(`Movie: ${m.title}, Format: ${m.format}`);
    });
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
