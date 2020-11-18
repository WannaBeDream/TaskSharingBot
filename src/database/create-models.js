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
 * @param {Object} advertisement
 * @property {Number} author - telegram ID
 * @property {string} title
 * @property {string} description
 * @property {Object} location - object with properties latitude and longitude
 * @property {string} category
 * @property {string} remuneration
 */
const createAdvertisement = async ({
    author,
    title,
    description,
    location: { latitude, longitude },
    category,
    remuneration
}) => {
    try {
        const model = new AdvertModel({
            author,
            title,
            description,
            location: { coordinates: [longitude, latitude] },
            category,
            remuneration,
            isActive: true
        });
        await model.save();
    } catch (e) {
        logger.error(e);
        throw new Error('Unable save advertisement');
    }
};

module.exports = { createUser, createAdvertisement };
