/* eslint-disable no-underscore-dangle */
const appStates = require('./app-states');
const { createUser, createAdvertisement } = require('../database/create');
const { updateUserState, updateAdState, addToSavedAds, deleteFromSavedAds } = require('../database/update');
const { findAdsWithinRadius, findMyAds, findSavedAds, findUser, findAdvertisement } = require('../database/find');
const { deleteAd } = require('../database/delete');

module.exports.findAllAds = async (userId) => {
    return findAdsWithinRadius(userId);
};

module.exports.findMyAdss = async (userId) => {
    return findMyAds(userId);
};

module.exports.findSavedAdss = async (userId) => {
    return findSavedAds(userId);
};

module.exports.deleteFromSaved = async (userId, adId) => {
    await deleteFromSavedAds(userId, adId);
};

module.exports.deleteMyAd = async (adId) => {
    await deleteAd(adId);
};

module.exports.addToSaved = async (userId, adId) => {
    await addToSavedAds(userId, adId);
};

module.exports.getUserState = async (userId) => {
    const user = await findUser(userId);
    if (user) {
        return user;
    }
    return { appStateId: appStates.NEW_USER_START.id, lang: 'en' };
};

module.exports.getAdState = async (userId) => {
    const ad = await findAdvertisement(userId);
    if (ad) {
        return ad;
    }
    return null;
};

module.exports.updateUser = async (userId, state) => {
    const user = await findUser(userId);
    if (user) {
        const u = { ...state._doc };
        u.appStateId = state.appStateId;
        // не лучшее что можно было сделать, но вроде работает Todo
        for (const key in u) {
            if (u.hasOwnProperty(key)) {
                for (const key2 in state) {
                    if (state.hasOwnProperty(key2)) {
                        if (key == key2) {
                            u[key2] = state[key2];
                        }
                    }
                }
            }
        }
        await updateUserState(userId, u);
    } else {
        await createUser(userId, state.appStateId, state.lang);
    }
};

module.exports.updateAdvertisement = async (userId, state) => {
    const advertisement = await findAdvertisement(userId);
    if (advertisement) {
        const stateAd = state.ad;
        const adClone = { ...advertisement._doc };
        // не лучшее что можно было сделать, но вроде работает Todo
        for (const key in adClone) {
            if (adClone.hasOwnProperty(key)) {
                for (const key2 in stateAd) {
                    if (stateAd.hasOwnProperty(key2)) {
                        if (key == key2) {
                            adClone[key2] = stateAd[key2];
                        }
                    }
                }
            }
        }
        await updateAdState(adClone._id, adClone);
    } else {
        await createAdvertisement(userId);
    }
};
