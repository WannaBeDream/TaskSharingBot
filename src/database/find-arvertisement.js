/* eslint-disable no-plusplus */
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
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates
                    },
                    $maxDistance: searchRadius
                }
            },
            author: { $ne: _id } // not return own user`s advertisements
        });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable find advertisements');
    }
};

module.exports = { findAdsWithinRadius };
