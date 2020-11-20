const { UserModel, AdvertModel } = require('../models');
const { findUser } = require('./find');

const updateUser = async (telegramId, data) => {
    try {
        return await UserModel.updateOne({ _id: telegramId }, data);
    } catch (e) {
        throw new Error('Unable update user');
    }
};

const updateAd = async (_id, data) => {
    try {
        return await AdvertModel.updateOne({ _id }, data);
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

module.exports = { updateUserState: updateUser, updateAdState: updateAd, addToSavedAds, deleteFromSavedAds };