const { logger } = require('../../helpers');
const { UserModel, AdvertModel } = require('../../models');

exports.createUser = async (user) => {
    try {
        const model = new UserModel(user);
        await model.save();
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable save user');
    }
};

exports.createAdvertisement = async (advertisement) => {
    try {
        const createdAd = await new AdvertModel(advertisement).save();
        return createdAd._id;
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable save advertisement');
    }
};
