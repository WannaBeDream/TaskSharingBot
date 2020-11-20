const { logger } = require('../helpers');
const { UserModel, AdvertModel } = require('../models');

/**
 * Return all advertisements in specific radius
 *
 * @async
 * @param {Number} telegramId
 * @returns {Array} Array of advertisements if they are exist, otherwise return empty array []
 */
const findAdsWithinRadius = async (telegramId) => {
    try {
        const {
            _id,
            searchRadius,
            location: { coordinates }
        } = await UserModel.findById(telegramId);

        return await AdvertModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates
                    },
                    $maxDistance: searchRadius * 1000000
                }
            },
            isActive: true,
            author: { $ne: _id } // not return own user`s advertisements
        });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable find advertisements');
    }
};

/**
 * Return own user`s advertisements
 *
 * @async
 * @param {Number} authorId - telegram ID
 * @returns {Array} Array of advertisements if they are exist, otherwise return empty array []
 */
const findMyAds = async (authorId) => {
    try {
        return await AdvertModel.find({ author: authorId, isActive: true });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable find your advertisements');
    }
};

/**
 * Return all advertisements with specific category, except user`s own advertisements
 *
 * @async
 * @param {Number} telegramId
 * @param {String} category
 * @returns {Array} Array of advertisements if they are exist, otherwise return empty array []
 */
const findAdsByCategory = async (telegramId, category) => {
    try {
        return await AdvertModel.find({ author: { $ne: telegramId }, category });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable find advertisements');
    }
};

/**
 * Return all saved advertisements
 *
 * @async
 * @param {Number} telegramId
 * @returns {Array} Array of advertisements if they are exist, otherwise return empty array []
 */
const findSavedAds = async (telegramId) => {
    try {
        const user = await UserModel.findById(telegramId);
        return user.savedAdvertisements;
    } catch (e) {
        throw new Error('Unable find saved advertisements');
    }
};

const findUser = async (telegramId) => {
    try {
        return await UserModel.findById(telegramId);
    } catch (e) {
        throw new Error('Unable find user');
    }
};

const findAdvertisement = async (telegramId) => {
    try {
        return await AdvertModel.findOne({ author: telegramId, isActive: false });
    } catch (e) {
        throw new Error('Unable find advertisement');
    }
};

module.exports = { findAdsWithinRadius, findMyAds, findAdsByCategory, findSavedAds, findUser, findAdvertisement };
