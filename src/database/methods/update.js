const { UserModel, AdvertModel } = require('../../models');
const { logger } = require('../../helpers');
const { SPAM_COUNTER } = require('../../constants/db-values');

const updateUser = async (telegramId, data) => {
    try {
        return await UserModel.findByIdAndUpdate({ _id: telegramId }, data);
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable update user');
    }
};

const updateAd = async (_id, data) => {
    try {
        return await AdvertModel.findByIdAndUpdate({ _id }, data);
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable update advertisement');
    }
};

const addToSavedAds = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        ad.usersSaved.push(userId);
        await updateAd(adId, ad);
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable add to saved');
    }
};

const deleteFromSavedAds = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        const updatedAds = ad.usersSaved.filter((item) => item !== userId);
        ad.usersSaved = updatedAds;
        await updateAd(adId, ad);
        return ad;
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable delete from saved');
    }
};

const markAsSpam = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        ad.spam.push(userId);
        await updateAd(adId, ad);
        if (ad.spam.length >= SPAM_COUNTER) {
            ad.isActive = false;
            await updateAd(adId, ad);
        }
        return ad.imgId;
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable mark as spam');
    }
};

const fetchUserAndUpdateAdvLoc = async (userId, newLocation) => {
    try {
        return await AdvertModel.updateMany({ author: userId }, { $set: { location: newLocation } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(`Unable update many advertisements\n${error.messages}`);
    }
};

const updateAdActiveStatus = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { isActive: data } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const updateTitleAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { title: data } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const updateDescriptionAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { description: data } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const updateCategoryAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { category: data } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const updateImageAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { imgId: data } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

const updateRemunerationAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { renumeration: data } });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error(error.message);
    }
};

module.exports = {
    updateUserState: updateUser,
    updateAdState: updateAd,
    addToSavedAds,
    deleteFromSavedAds,
    markAsSpam,
    fetchUserAndUpdateAdvLoc,
    updateAdActiveStatus,
    updateTitleAd,
    updateDescriptionAd,
    updateCategoryAd,
    updateImageAd,
    updateRemunerationAd
};
