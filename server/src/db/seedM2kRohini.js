const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

require('./mongoose');

const Cinema = require('../models/cinema');
const { buildM2kRohiniLayout } = require('../utils/cinemaLayouts/m2kRohini');
const { applyM2kVenueMeta } = require('../utils/cinemaLayouts/m2kAddresses');

const seedM2kRohini = async () => {
  try {
    const layout = applyM2kVenueMeta(buildM2kRohiniLayout());
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
    console.error('Error seeding M2K Rohini:', error);
    process.exit(1);
  }
};

seedM2kRohini();
