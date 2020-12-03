const mongoose = require('mongoose');

let cachedDb = null;

const connectToDatabase = async (uri) => {
    if (cachedDb) {
        return cachedDb;
    }

    cachedDb = await mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true
    });

    return cachedDb;
};

module.exports = { connectToDatabase };
