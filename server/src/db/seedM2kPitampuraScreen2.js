const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

require('./mongoose');

const Cinema = require('../models/cinema');
const { buildM2kPitampuraScreen2Layout } = require('../utils/cinemaLayouts/m2kPitampuraScreen2');

const seedM2kPitampuraScreen2 = async () => {
  try {
    const layout = buildM2kPitampuraScreen2Layout();
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
    console.error('Error seeding M2K Pitampura Screen 2:', error);
    process.exit(1);
  }
};

seedM2kPitampuraScreen2();
