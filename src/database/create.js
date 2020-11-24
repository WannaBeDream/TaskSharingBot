const { logger } = require('../helpers');
const { UserModel, AdvertModel } = require('../models');

/**
 * Create and save User object
 *
 * @async
 * @param {Number} _id - telegram ID
 * @param {string} lang
 * @param {string} appState
 */
const createUser = async (user) => {
    try {
        const model = new UserModel(user);
        await model.save();
    } catch (e) {
        logger.error(e);
        throw new Error('Unable save user');
    }
};

/**
 * Create and save Advertisement object
 *
 * @async
 * @property {Number} author - telegram ID
 */
const createAdvertisement = async (advertisement) => {
    try {
        const model = new AdvertModel(advertisement);
        await model.save();
    } catch (e) {
        logger.error(e);
        throw new Error('Unable save advertisement');
    }
};

module.exports = { createUser, createAdvertisement };
