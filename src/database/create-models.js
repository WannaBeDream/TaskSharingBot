const { logger } = require('../helpers');
const { UserModel } = require('../models');

/**
 * Create and save User object
 *
 * @async
 * @param {Number} _id - telegram ID
 * @param {Object} location - object with properties latitude and longitude
 * @param {Number} searchRadius - in metres
 */
const createUser = async (_id, { latitude, longitude }, searchRadius) => {
    try {
        const model = new UserModel({
            _id,
            location: { coordinates: [longitude, latitude] },
            searchRadius
        });
        await model.save();
    } catch (e) {
        logger.error(e);
        throw new Error('Unable save user');
    }
};

module.exports = { createUser };
