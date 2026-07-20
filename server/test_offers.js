const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/movie-plus', { useNewUrlParser: true, useUnifiedTopology: true })
.then(async () => {
    const db = mongoose.connection.db;
    const offers = await db.collection('offers').find({}).toArray();
    console.log(JSON.stringify(offers, null, 2));
    process.exit(0);
});
