const { UserModel, AdvertModel } = require('../../models');
const { logger } = require('../../helpers');
const { SPAM_COUNTER } = require('../constants');

const updateUser = async (telegramId, data) => {
    try {
        return UserModel.findByIdAndUpdate({ _id: telegramId }, data);
    } catch (e) {
        logger.error(e);
        throw new Error('Unable update user');
    }
};

const updateAd = async (_id, data) => {
    try {
        return AdvertModel.findByIdAndUpdate({ _id }, data);
    } catch (e) {
        logger.error(e);
        throw new Error('Unable update advertisement');
    }
};

const addToSavedAds = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        ad.usersSaved.push(userId);
        await updateAd(adId, ad);
    } catch (e) {
        logger.error(e);
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
    } catch (e) {
        logger.error(e);
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
    } catch (e) {
        logger.error(e);
        throw new Error('Unable mark as spam');
    }
};

const fetchUserAndUpdateAdvLoc = async (userId, newLocation) => {
    try {
        return AdvertModel.updateMany({ author: userId }, { $set: { location: newLocation } });
    } catch (e) {
        logger.error(e);
        throw new Error(`Unable update many advertisements\n${e.messages}`);
    }
};

const updateAdActiveStatus = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { isActive: data } });
    } catch (e) {
        logger.error(e);
        throw new Error(e.message);
    }
};

const updateTitleAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { title: data } });
    } catch (e) {
        logger.error(e);
        throw new Error(e.message);
    }
};

const updateDescriptionAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { description: data } });
    } catch (e) {
        logger.error(e);
        throw new Error(e.message);
    }
};

const updateCategoryAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { category: data } });
    } catch (e) {
        logger.error(e);
        throw new Error(e.message);
    }
};

const updateImageAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { imgId: data } });
    } catch (e) {
        logger.error(e);
        throw new Error(e.message);
    }
};

const updateRemunerationAd = async (_id, data) => {
    try {
        await AdvertModel.findByIdAndUpdate({ _id }, { $set: { renumeration: data } });
    } catch (e) {
        logger.error(e);
        throw new Error(e.message);
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
