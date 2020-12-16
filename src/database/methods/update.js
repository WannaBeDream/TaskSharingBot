const { UserModel, AdvertModel } = require('../../models');
const { logger } = require('../../helpers');
const { SPAM_COUNTER } = require('../../constants/db-values');

exports.updateUserLang = async (_id, lang) => {
    try {
        await UserModel.findByIdAndUpdate({ _id }, { $set: { lang } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};
exports.updateUserLocation = async (userId, location) => {
    try {
        await UserModel.findByIdAndUpdate({ _id: userId }, { $set: { location } });
        await AdvertModel.updateMany({ author: userId }, { $set: { location } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};
exports.updateUserSearchRadius = async (_id, searchRadius) => {
    try {
        await UserModel.findByIdAndUpdate({ _id }, { $set: { searchRadius } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};
exports.updateUserAppState = async (_id, appStateId, appStateData) => {
    try {
        await UserModel.findByIdAndUpdate({ _id }, { $set: { appStateId, appStateData } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

exports.updateAdState = async (_id, data) => {
    try {
        return await AdvertModel.findByIdAndUpdate({ _id }, data);
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable update advertisement');
    }
};

exports.addToSavedAds = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        ad.usersSaved.push(userId);
        await exports.updateAdState(adId, ad);
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable add to saved');
    }
};

exports.deleteFromSavedAds = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        const updatedAds = ad.usersSaved.filter((item) => item !== userId);
        ad.usersSaved = updatedAds;
        await exports.updateAdState(adId, ad);
        return ad;
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable delete from saved');
    }
};

exports.markAsSpam = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        ad.spam.push(userId);
        ad.isActive = !ad.spam.length >= SPAM_COUNTER;
        await exports.updateAdState(adId, ad);
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error('Unable mark as spam');
    }
};

exports.updateAdActiveStatus = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { isActive: data } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

exports.updateAdTitle = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { title: data } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

exports.updateAdDescription = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { description: data } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

exports.updateAdCategory = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { category: data } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

exports.updateAdImage = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { imgId: data } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};

exports.updateAdRemuneration = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { renumeration: data } });
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        throw new Error(error.message);
    }
};
