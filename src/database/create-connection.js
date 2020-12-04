const mongoose = require('mongoose');

const { logger } = require('../helpers');

let cachedDb = null;

const connectToDatabase = async (uri) => {
    try {
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
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        return error.message;
    }
};

module.exports = { connectToDatabase };
