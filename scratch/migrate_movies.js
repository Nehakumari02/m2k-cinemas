const mongoose = require('mongoose');
const Movie = require('../server/src/models/movie');
require('../server/src/db/mongoose');

async function migrate() {
  try {
    const result = await Movie.updateMany(
      { isPublished: { $exists: false } },
      { $set: { isPublished: true } }
    );
    console.log('Migration complete:', result);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

migrate();
