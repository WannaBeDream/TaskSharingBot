const { logger } = require('../../helpers');
const { UserModel, AdvertModel } = require('../../models');
const { ADS_PAGE_SIZE } = require('../../constants/db-values');

exports.findUser = async (id) => {
    try {
        const user = await UserModel.findById(id);
        return user && user._doc;
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable find user');
    }
};

exports.findAdvertisement = async (id) => {
    try {
        return await AdvertModel.findById(id);
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

async function findMyAds(author) {
    try {
        return await AdvertModel.find({ author }).sort({ updatedAt: -1 });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable find your advertisements');
    }
}
async function findSavedAds(user) {
    try {
        return await AdvertModel.find({ usersSaved: { $in: [user] }, spam: { $nin: [user] } }).sort({ updatedAt: -1 });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable find saved advertisements');
    }
}
async function findLocalAds({ location, radius, user, category }) {
    try {
        return await AdvertModel.find({
            location: {
                $nearSphere: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [location.longitude, location.latitude]
                    },
                    $maxDistance: radius * 1000
                }
            },
            isActive: true,
            ...(category ? { category } : {}),
            spam: { $nin: [user] },
            author: { $ne: user } // not return own user`s advertisements
        }).sort({ updatedAt: -1 });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable find advertisements');
    }
}

exports.findAdsByCriteria = async (criteria) => {
    try {
        // eslint-disable-next-line no-nested-ternary
        const foundAds = criteria.location
            ? await findLocalAds(criteria)
            : criteria.author
            ? await findMyAds(criteria.author)
            : await findSavedAds(criteria.user);
        const offset = criteria.page * ADS_PAGE_SIZE;
        const adsSlice = foundAds.slice(offset, offset + ADS_PAGE_SIZE).map((ad) => ad._doc);
        return { adsSlice, numberOfPages: Math.ceil(foundAds.length / ADS_PAGE_SIZE) };
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};
