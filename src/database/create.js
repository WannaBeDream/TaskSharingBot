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
const createUser = async (_id, appStateId, lang) => {
    try {
        const model = new UserModel({
            _id,
            lang,
            appStateId
        });
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
const createAdvertisement = async (author) => {
    try {
        const model = new AdvertModel({ author });
        await model.save();
    } catch (e) {
        logger.error(e);
        throw new Error('Unable save advertisement');
    }
};

module.exports = { createUser, createAdvertisement };
