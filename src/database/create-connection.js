const mongoose = require('mongoose');
const { logger } = require('../helpers');

const connect = async (url) => {
    try {
        await mongoose.connect(url, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
    } catch (e) {
        logger.error(e);
        throw new Error(`Connection to MongoDB is rejected: ${e.message}`);
    }
};

module.exports = { connect };
