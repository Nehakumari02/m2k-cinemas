const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/pvrcinemas', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const db = mongoose.connection.db;
    const reservations = await db.collection('reservations').find({}).sort({ createdAt: -1 }).limit(3).toArray();
    console.log(JSON.stringify(reservations, null, 2));
    process.exit(0);
});
