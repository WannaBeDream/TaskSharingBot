const mongoose = require('mongoose');

let cachedDb = null;

const connectToDatabase = async (uri) => {
    if (cachedDb) {
        return cachedDb;
    }

    const db = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
    cachedDb = db;
    return cachedDb;
};

module.exports = { connectToDatabase };
