/* eslint-disable no-underscore-dangle */
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

        return AdvertModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates
                    },
                    $maxDistance: searchRadius * 1000000 // DON`T FORGET TO CHANGE -> 1000
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

const findMyAds = async (criteria) => {
    try {
        return AdvertModel.find({ author: criteria.author, isActive: true });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable find your advertisements');
    }
};

const findAdsByCategory = async (criteria) => {
    try {
        return AdvertModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [criteria.location.longitude, criteria.location.latitude]
                    },
                    $maxDistance: criteria.radius * 1000 // DON`T FORGET TO CHANGE -> 1000 => solved
                }
            },
            isActive: true,
            category: criteria.category,
            author: { $ne: criteria.user } // not return own user`s advertisements
        });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable find advertisements');
    }
};

const findSavedAds = async (criteria) => {
    try {
        const user = await UserModel.findById(criteria.user);
        return user.savedAdvertisements;
    } catch (e) {
        throw new Error('Unable find saved advertisements');
    }
};

const findUser = async (telegramId) => {
    try {
        const user = await UserModel.findById(telegramId);
        return user && user._doc;
    } catch (e) {
        throw new Error('Unable find user');
    }
};

const findAdvertisement = async (telegramId) => {
    try {
        const ad = await AdvertModel.findOne({ author: telegramId, isActive: false });
        return ad._doc;
    } catch (e) {
        throw new Error('Unable find advertisement');
    }
};

const findAdAndReturnOneField = async (id, data) => {
    try {
        return AdvertModel.findById({ _id: id }, data);
    } catch (e) {
        throw new Error(e.message);
    }
};

const findAdAndReturn = async (id) => {
    try {
        return AdvertModel.findById({ _id: id });
    } catch (e) {
        throw new Error(e.message);
    }
};

const findUserAndReturnOneField = async (id) => {
    try {
        return AdvertModel.findById({ _id: id }, { activeAdToUpdate: true });
    } catch (e) {
        throw new Error(e.message);
    }
};

const PAGE_SIZE = 5;

/* logic might be optimized
   criteria: category, location, radius, author, user, active, page
*/
const findAdsByCriteria = async (criteria) => {
    // eslint-disable-next-line no-nested-ternary
    const foundAds = criteria.category
        ? await findAdsByCategory(criteria)
        : criteria.author
        ? await findMyAds(criteria)
        : await findSavedAds(criteria);
    const offset = criteria.page * PAGE_SIZE;
    const adsSlice = foundAds.slice(offset, offset + PAGE_SIZE).map((ad) => ad._doc);
    return { adsSlice, numberOfPages: Math.ceil(foundAds.length / PAGE_SIZE) };
};

module.exports = {
    findAdsByCriteria,
    findAdsWithinRadius,
    findMyAds,
    findAdsByCategory,
    findSavedAds,
    findUser,
    findAdvertisement,
    findAdAndReturnOneField,
    findAdAndReturn,
    findUserAndReturnOneField
};
