/* eslint-disable no-param-reassign */
const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const commandParser = require('./commandParser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('./labels');
const { connect } = require('../database/create-connection');

module.exports = async (update) => {
    try {
        await connect(MONGO_URI); // TODO REDO https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/#example

        // Handle data from inline keyboard
        if (update.originalRequest.callback_query !== undefined) {
            const { idAd, op } = JSON.parse(update.originalRequest.callback_query.data);

            // Todo - make constants
            switch (op) {
                case 'ADD_TO_SAVED':
                    await appStateDao.addToSaved(update.originalRequest.callback_query.from.id, idAd);
                    break;
                case 'DELETE_FROM_SAVED':
                    await appStateDao.deleteFromSaved(update.originalRequest.callback_query.from.id, idAd);
                    break;
                case 'DELETE_MY_AD':
                    await appStateDao.deleteMyAd(idAd);
                    break;
                default:
                    break;
            }
            // Todo - land, message
            return 'Done';
        }

        const userId = update.originalRequest.message.from.id;

        const userState = await appStateDao.getUserState(userId);
        const advertisementState = await appStateDao.getAdState(userId);

        const command = commandParser(update.text, userState.lang);

        const transition = STATE_MACHINE[userState.appStateId][command.id];

        if (!transition) {
            return langResources.unknownCommand[userState.lang];
        }
        update.userState = userState;
        update.advertisementState = advertisementState;

        let reply = [];
        if (transition.handler) {
            const commandProcessResult = transition.handler(update);
            if (commandProcessResult) {
                reply.push(commandProcessResult);
            }
        }
        const markup = transition.targetState.constructor(update);
        if (Array.isArray(markup)) {
            reply.push(...markup);
        } else {
            reply.push(markup);
        }

        const action = { ...userState };

        let ads = [];
        // переменная устанавливается во время действий
        switch (action.act) {
            case 'USER_ACT':
                await appStateDao.updateUser(userId, { ...userState, appStateId: transition.targetState.id });
                break;
            case 'AD_ACT':
                await appStateDao.updateUser(userId, { ...userState, appStateId: transition.targetState.id });
                await appStateDao.updateAdvertisement(userId, {
                    ...userState,
                    appStateId: transition.targetState.id
                });
                break;
            case 'AD_DISPLAY_ALL_ACT':
                await appStateDao.updateUser(userId, { ...userState, appStateId: transition.targetState.id });
                ads = await appStateDao.findAllAds(userId);
                break;
            case 'AD_DISPLAY_MY_ACT':
                await appStateDao.updateUser(userId, { ...userState, appStateId: transition.targetState.id });
                ads = await appStateDao.findMyAdss(userId);
                break;
            case 'AD_DISPLAY_SAVED_ACT':
                await appStateDao.updateUser(userId, { ...userState, appStateId: transition.targetState.id });
                ads = await appStateDao.findSavedAdss(userId);
                break;
            default:
                break;
        }
        // If ads were found
        if (ads.length !== 0) {
            update.advertisements = ads;
            reply = [];
            const markup2 = transition.targetState.constructor(update);
            if (Array.isArray(markup2)) {
                reply.push(...markup2);
            } else {
                reply.push(markup2);
            }
            return reply;
        }
        return reply;
    } catch (error) {
        // Todo
        return error.message;
    }
};
