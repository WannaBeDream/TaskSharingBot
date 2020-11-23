/* eslint-disable no-param-reassign */
const { telegramTemplate } = require('claudia-bot-builder');
const {
    ADD_TO_SAVED,
    AD_DISPLAY_ALL_ACT,
    DELETE_FROM_SAVED,
    DELETE_MY_AD,
    AD_DISPLAY_MY_ACT,
    AD_DISPLAY_SAVED_ACT,
    SPAM
} = require('../constants');
const labels = require('./labels');
const { AD_TEMPLATE } = require('../ad-template');

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.displayAllAds = (update) => {
    update.userState.act = AD_DISPLAY_ALL_ACT; // Todo Make constant
    if (update.advertisements !== undefined) {
        return update.advertisements.map(({ _id: id, title, author, description, renumeration }) => {
            const callbackData = JSON.stringify({
                idAd: id,
                op: ADD_TO_SAVED
            });
            const spamCallbackData = JSON.stringify({
                idAd: id,
                op: SPAM
            });
            return new telegramTemplate.Text(AD_TEMPLATE(update, title, author, description, renumeration))
                .addInlineKeyboard([
                    [
                        {
                            text: labels.spamMessage[update.userState.lang],
                            callback_data: callbackData
                        },
                        {
                            text: labels.addToSavedMessage[update.userState.lang],
                            callback_data: spamCallbackData
                        }
                    ]
                ])
                .get();
        });
    }
    return new telegramTemplate.Text(labels.ifEmptyArrayMessage[update.userState.lang]).get();
};

exports.displayMyAds = (update) => {
    update.userState.act = AD_DISPLAY_MY_ACT;
    if (update.advertisements !== undefined) {
        return update.advertisements.map(({ _id: id, title, author, description, renumeration }) => {
            const callbackData = JSON.stringify({
                idAd: id,
                op: DELETE_MY_AD
            });
            return new telegramTemplate.Text(AD_TEMPLATE(update, title, author, description, renumeration))
                .addInlineKeyboard([
                    [
                        {
                            text: labels.deleteMyMessage[update.userState.lang],
                            callback_data: callbackData
                        }
                    ]
                ])
                .get();
        });
    }
    return new telegramTemplate.Text(labels.ifEmptyArrayMessage[update.userState.lang]).get();
};

exports.displaySavedAds = (update) => {
    update.userState.act = AD_DISPLAY_SAVED_ACT;
    if (update.advertisements !== undefined) {
        return update.advertisements.map(({ _id: id, title, author, description, renumeration }) => {
            const callbackData = JSON.stringify({
                idAd: id,
                op: DELETE_FROM_SAVED
            });
            return new telegramTemplate.Text(AD_TEMPLATE(update, title, author, description, renumeration))
                .addInlineKeyboard([
                    [
                        {
                            text: labels.deleteFromSavedMessage[update.userState.lang],
                            callback_data: callbackData
                        }
                    ]
                ])
                .get();
        });
    }
    return new telegramTemplate.Text(labels.ifEmptyArrayMessage[update.userState.lang]).get();
};
