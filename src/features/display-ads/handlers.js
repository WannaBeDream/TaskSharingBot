/* eslint-disable no-param-reassign */
const { telegramTemplate } = require('claudia-bot-builder');
const {
    ADD_TO_SAVED,
    AD_DISPLAY_ALL_ACT,
    DELETE_FROM_SAVED,
    DELETE_MY_AD,
    AD_DISPLAY_MY_ACT,
    AD_DISPLAY_SAVED_ACT
} = require('../constants');

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
            return new telegramTemplate.Text(`
            ===============================
            [   Author](tg://user?id=${author})

            *❗️ ${title} ❗️*

            ${description}

            🎁   ${renumeration}   🎁
            ===============================
            `)
                .addInlineKeyboard([
                    [
                        {
                            text: '❤️',
                            callback_data: callbackData
                        }
                    ]
                ])
                .get();
        });
    }
    // Todo - make constatns + lang
    return 'Nothing to display';
};

exports.displayMyAds = (update) => {
    update.userState.act = AD_DISPLAY_MY_ACT;
    if (update.advertisements !== undefined) {
        return update.advertisements.map(({ _id: id, title, author, description, renumeration }) => {
            const callbackData = JSON.stringify({
                idAd: id,
                op: DELETE_MY_AD
            });
            return new telegramTemplate.Text(`
            ===============================
            [   Author](tg://user?id=${author})

            *❗️ ${title} ❗️*

            ${description}

            🎁   ${renumeration}   🎁
            ===============================
            `)
                .addInlineKeyboard([
                    [
                        {
                            text: '☠️',
                            callback_data: callbackData
                        }
                    ]
                ])
                .get();
        });
    }
    return 'Nothing to display';
};

exports.displaySavedAds = (update) => {
    update.userState.act = AD_DISPLAY_SAVED_ACT;
    if (update.advertisements !== undefined) {
        return update.advertisements.map(({ _id: id, title, author, description, renumeration }) => {
            const callbackData = JSON.stringify({
                idAd: id,
                op: DELETE_FROM_SAVED
            });
            return new telegramTemplate.Text(`
            ===============================
            [   Author](tg://user?id=${author})

            *❗️ ${title} ❗️*

            ${description}

            🎁   ${renumeration}   🎁
            ===============================
            `)
                .addInlineKeyboard([
                    [
                        {
                            text: '💀',
                            callback_data: callbackData
                        }
                    ]
                ])
                .get();
        });
    }
    return 'Nothing to display';
};
