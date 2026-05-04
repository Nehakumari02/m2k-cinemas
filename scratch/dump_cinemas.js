const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../server/.env') });

const cinemaSchema = new mongoose.Schema({
  name: String,
  ticketPrice: Number,
  specialPrice: Number,
  seats: [[Number]]
});
const Cinema = mongoose.model('Cinema', cinemaSchema);

async function dump() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-app', {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    const cinemas = await Cinema.find({});
    cinemas.forEach(c => {
      console.log(`--- ${c.name} ---`);
      console.log(`Normal: ${c.ticketPrice}, Special: ${c.specialPrice}`);
      const specialSeatsCount = c.seats.flat().filter(s => s === 5).length;
      console.log(`Special seats count: ${specialSeatsCount}`);
    });
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

dump();
