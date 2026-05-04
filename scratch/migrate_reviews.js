const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });
require('../server/src/db/mongoose');
const Review = require('../server/src/models/review');

async function migrate() {
  try {
    const result = await Review.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'Approved', isHighlighted: false } }
    );
    console.log('Migration complete:', result);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

migrate();
