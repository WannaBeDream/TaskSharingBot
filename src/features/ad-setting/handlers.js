/* eslint-disable no-param-reassign */
const { telegramTemplate } = require('claudia-bot-builder');
const labels = require('./labels');
const commands = require('./commands');
const { GO_BACK: backCommand } = require('../../router/general-commands');
const { AD_ACT } = require('../constants');

// ////////////////////////////////////////////////// //
//                  Display messages                  //
// ////////////////////////////////////////////////// //

exports.userSetAdNameView = (update) => {
    update.userState.act = AD_ACT;
    return new telegramTemplate.Text(labels.newUserSetAdNameView[update.userState.lang]).replyKeyboardHide().get();
};

exports.initUserSetAdDescriptionView = (update) => {
    update.userState.act = AD_ACT;
    return new telegramTemplate.Text(labels.newUserSetAdDescriptionView[update.userState.lang])
        .replyKeyboardHide()
        .get();
};

exports.userSetAdRenumerationView = (update) => {
    update.userState.act = AD_ACT;
    return new telegramTemplate.Text(labels.newUserEnterRenumeration[update.userState.lang]).replyKeyboardHide().get();
};

exports.userSetAdCategotyView = (update) => {
    update.userState.act = AD_ACT;
    // Todo change lang !!
    return new telegramTemplate.Text(labels.newUserSetAdCategotyView[update.userState.lang])
        .addReplyKeyboard(
            [
                ['Фізична', 'Інтелектуальна'],
                ['Ментальна', 'Часова']
            ],
            true
        )
        .get();
};

exports.userSetAdLocationView = (update) => {
    update.userState.act = AD_ACT;
    return new telegramTemplate.Text(labels.newUserEnterAdLocation[update.userState.lang]).replyKeyboardHide().get();
};

exports.userPublishAdView = (update) => {
    update.userState.act = AD_ACT;
    const {
        sender,
        originalRequest: {
            message: {
                from: { first_name: name }
            }
        },
        advertisementState: { title, description, renumeration }
    } = update;
    return new telegramTemplate.Text(`
    ===============================
    [  ${name}](tg://user?id=${sender})

    *❗️ ${title} ❗️*

    ${description}

    🎁   ${renumeration}   🎁
    ===============================
    `)
        .addReplyKeyboard(
            [[commands.CANCEL_AD.title[update.userState.lang]], [commands.PUBLISH_AD.title[update.userState.lang]]],
            true
        )
        .get();
};

exports.congratulations = (update) => {
    update.userState.act = AD_ACT;
    return new telegramTemplate.Text(`Congratulations`)
        .addReplyKeyboard([[backCommand.title[update.userState.lang]]], true)
        .get();
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setTitle = (update) => {
    update.userState.act = AD_ACT;
    const { text } = update.originalRequest.message;
    update.userState.ad = {};
    update.userState.ad.title = text;
};

exports.setDescription = (update) => {
    update.userState.act = AD_ACT;
    const { text } = update.originalRequest.message;
    update.userState.ad = {};
    update.userState.ad.description = text;
};

exports.setRenumeration = (update) => {
    update.userState.act = AD_ACT;
    const { text } = update.originalRequest.message;
    update.userState.ad = {};
    update.userState.ad.renumeration = text;
};

exports.setCategory = (update) => {
    update.userState.act = AD_ACT;
    const { text } = update.originalRequest.message;
    update.userState.ad = {};
    update.userState.ad.category = text;
};

exports.setLocation = (update) => {
    update.userState.act = AD_ACT;
    const { location } = update.originalRequest.message;
    if (!location) {
        throw new Error(labels.locationNotSet[update.userState.lang]);
    }
    update.userState.ad = {};
    update.userState.ad.location = { type: 'Point', coordinates: [location.longitude, location.latitude] };
};

exports.publish = (update) => {
    update.userState.act = AD_ACT;
    const { text } = update.originalRequest.message;
    update.userState.ad = {};
    update.userState.ad.isActive = text === commands.PUBLISH_AD.title[update.userState.lang];
};
