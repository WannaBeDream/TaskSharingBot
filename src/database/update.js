const { UserModel, AdvertModel } = require('../models');
const { findUser } = require('./find');

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

const updateTitleAd = async (_id, data) => {
    try {
        return AdvertModel.findByIdAndUpdate({ _id }, { $set: { title: data } });
    } catch (e) {
        throw new Error(e.message);
    }
};

const updateDescriptionAd = async (_id, data) => {
    try {
        return AdvertModel.findByIdAndUpdate({ _id }, { $set: { description: data } });
    } catch (e) {
        throw new Error(e.message);
    }
};

const updateCategoryAd = async (_id, data) => {
    try {
        return AdvertModel.findByIdAndUpdate({ _id }, { $set: { category: data } });
    } catch (e) {
        throw new Error(e.message);
    }
};

const updateRemunerationAd = async (_id, data) => {
    try {
        return AdvertModel.findByIdAndUpdate({ _id }, { $set: { renumeration: data } });
    } catch (e) {
        throw new Error(e.message);
    }
};

module.exports = {
    updateUserState: updateUser,
    updateAdState: updateAd,
    addToSavedAds,
    deleteFromSavedAds,
    updateTitleAd,
    updateDescriptionAd,
    updateCategoryAd,
    updateRemunerationAd
};
