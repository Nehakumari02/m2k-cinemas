const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

require('./mongoose');

const Cinema = require('../models/cinema');
const { buildM2kPitampuraScreen3Layout } = require('../utils/cinemaLayouts/m2kPitampuraScreen3');

const seedM2kPitampuraScreen3 = async () => {
  try {
    const layout = buildM2kPitampuraScreen3Layout();
    const cinema = await Cinema.findOneAndUpdate(
      { name: layout.name },
      layout,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log(`Seeded cinema: ${cinema.name} (${cinema._id})`);
    console.log(`  City: ${cinema.city}`);
    console.log(`  Rows: ${cinema.seats.length}, bookable seats: ${cinema.seatsAvailable}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding M2K Pitampura Screen 3:', error);
    process.exit(1);
  }
};

seedM2kPitampuraScreen3();
