const { UserModel, AdvertModel } = require('../models');
const { findUser } = require('./find');
const { deleteAd } = require('./delete');
const { logger } = require('../helpers');

const updateUser = async (telegramId, data) => {
    try {
        return UserModel.updateOne({ _id: telegramId }, data);
    } catch (e) {
        throw new Error('Unable update user');
    }
};

const updateAd = async (_id, data) => {
    try {
        return AdvertModel.updateOne({ _id }, data);
    } catch (e) {
        throw new Error('Unable update advertisement');
    }
};

const addToSavedAds = async (userId, adId) => {
    try {
        const user = await findUser(userId);
        user.savedAdvertisements.push(adId);
        await updateUser(userId, user);
    } catch (e) {
        throw new Error('Unable add to saved');
    }
};

const deleteFromSavedAds = async (userId, adId) => {
    try {
        const user = await findUser(userId);
        const updatedAds = user.savedAdvertisements.filter(({ _id: id }) => id.toString() !== adId);
        user.savedAdvertisements = updatedAds;
        await updateUser(userId, user);
    } catch (e) {
        throw new Error('Unable delete from saved');
    }
};

const markAsSpam = async (userId, adId) => {
    try {
        const ad = await AdvertModel.findByIdAndUpdate(adId);
        ad.spam.push(userId);
        await updateAd(adId, ad);
        if (ad.spam.length >= 5) {
            await deleteAd(adId);
        }
    } catch (e) {
        throw new Error('Unable mark as spam');
    }
};

const fetchUserAndUpdateAdvLoc = async (userId, newLocation) => {
    try {
        return AdvertModel.updateMany({ author: userId }, { $set: { location: newLocation } });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable update many advertisments', e);
    }
};

module.exports = {
    updateUserState: updateUser,
    updateAdState: updateAd,
    addToSavedAds,
    deleteFromSavedAds,
    markAsSpam,
    fetchUserAndUpdateAdvLoc
};
