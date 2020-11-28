const { logger } = require('../../helpers');
const { UserModel, AdvertModel } = require('../../models');

const createUser = async (user) => {
    try {
        const model = new UserModel(user);
        await model.save();
    } catch (e) {
        logger.error(e);
        throw new Error('Unable save user');
    }
};

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
