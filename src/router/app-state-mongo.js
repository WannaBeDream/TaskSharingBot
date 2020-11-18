/* eslint-disable no-underscore-dangle */
const appStates = require('./app-states');
const { findUser } = require('../database/find-user');
const { createUser } = require('../database/create-models');
const { updateUserState } = require('../database/update-user');

module.exports.getUserState = async (userId) => {
    const user = await findUser(userId);
    if (user) {
        return user;
    }
    return { appStateId: appStates.NEW_USER_START.id, lang: 'en' };
};

module.exports.setUserState = async (userId, state) => {
    const user = await findUser(userId);
    if (user) {
        const u = { ...state._doc };
        u.appStateId = state.appStateId;

        // не лучшее что можно было сделать, но вроде работает
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
