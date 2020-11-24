/* eslint-disable no-underscore-dangle */
const appStates = require('./app-states');
const { createUser } = require('../database/create');
const { updateUserState } = require('../database/update');
const { findUser } = require('../database/find');

module.exports.getUserState = async (userId) => {
    let user = await findUser(userId);
    if (!user) {
        user = { _id: userId, appStateId: appStates.NEW_USER_START.id, lang: 'en' };
        await createUser(user);
    }
    return user;
};

module.exports.setUserState = async (userId, userState) => {
    await updateUserState(userId, userState);
};
