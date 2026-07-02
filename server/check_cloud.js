const mongoose = require('mongoose');

async function check() {
  try {
    await mongoose.connect('mongodb+srv://m2k-cinemas:Cinemas123@cluster0.qwtyea6.mongodb.net/pvrcinemas', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to Cloud DB");
    const db = mongoose.connection.db;
    const count = await db.collection('products').countDocuments();
    const allProducts = await db.collection('products').find({}).toArray();
    console.log(`Products in Cloud DB: ${count}`);
    console.log(JSON.stringify(allProducts, null, 2));
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
}
check();
