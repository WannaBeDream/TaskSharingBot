const { logger } = require('../../helpers');
const { UserModel, AdvertModel } = require('../../models');

const createUser = async (user) => {
    try {
        const model = new UserModel(user);
        await model.save();
    } catch (error) {
        logger.error({
            timestamp: '',
            level: 'error',
            errorIn: 'database/methods/create.js/createUser',
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable save user');
    }
};

const createAdvertisement = async (advertisement) => {
    try {
        const createdAd = await new AdvertModel(advertisement).save();
        return createdAd._id;
    } catch (error) {
        logger.error({
            timestamp: '',
            level: 'error',
            errorIn: 'database/methods/create.js/createAdvertisement',
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable save advertisement');
    }
};

module.exports = { createUser, createAdvertisement };
