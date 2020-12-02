/* eslint-disable no-underscore-dangle */
const { Text, Sticker } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const { SKIP: skipCommand } = require('../general-commands');
const { AD_TEMPLATE } = require('../ad-template');

const { findAdvertisement, findUser } = require('../../database/methods/find');
const { createAdvertisement } = require('../../database/methods/create');
const { updateAdState } = require('../../database/methods/update');
const { userInputData } = require('../../validators/ad-validation');
const { checkMaxMinReg, categoryError } = require('../validations-labels');
const {
    titleLength,
    descriptionLength,
    remunerationLength,
    regExpForAd,
    strArrForCategory
} = require('../../constants/ad-values');
const { deleteAd } = require('../../database/methods/delete');

// ////////////////////////////////////////////////// //
//                  Display messages                  //
// ////////////////////////////////////////////////// //

exports.userSetAdNameView = (context) => {
    return new Text(labels.newUserSetAdNameView[context.lang]).replyKeyboardHide().get();
};

exports.userSetAdDescriptionView = (context) => {
    return new Text(labels.newUserSetAdDescriptionView[context.lang]).replyKeyboardHide().get();
};

exports.userSetAdRenumerationView = (context) => {
    return new Text(labels.newUserEnterRenumeration[context.lang])
        .addReplyKeyboard([[skipCommand.title[context.lang]]], true)
        .get();
};

exports.userSetAdCategotyView = (context) => {
    return new Text(labels.newUserSetAdCategotyView[context.lang])
        .addReplyKeyboard(
            [
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [inputCms.LOST_FOUND_ADS.title[context.lang]]
            ],
            true
        )
        .get();
};

exports.userSetAdImgView = (context) => {
    return new Text(labels.newUserEnterImg[context.lang])
        .addReplyKeyboard([[skipCommand.title[context.lang]]], true)
        .get();
};

exports.userPublishAdView = async (context) => {
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    if (!ad.imgId) {
        return new Text(AD_TEMPLATE(ad, context.lang))
            .addReplyKeyboard(
                [[commands.CANCEL_AD.title[context.lang]], [commands.PUBLISH_AD.title[context.lang]]],
                true
            )
            .get();
    }
    return {
        method: 'sendPhoto',
        body: {
            photo: `${ad.imgId}`,
            caption: AD_TEMPLATE(ad, context.lang),
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [[commands.CANCEL_AD.title[context.lang]], [commands.PUBLISH_AD.title[context.lang]]],
                resize_keyboard: true
            }
        }
    };
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setTitle = async (context) => {
    // eslint-disable-next-line security/detect-non-literal-regexp
    const validationResult = userInputData.ifStrCondition(context.inputData, titleLength, new RegExp(regExpForAd));

    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](titleLength.min, titleLength.max));
    }

    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.title = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.setDescription = async (context) => {
    const validationResult = userInputData.ifStrCondition(
        context.inputData,
        descriptionLength,
        // eslint-disable-next-line security/detect-non-literal-regexp
        new RegExp(regExpForAd)
    );
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](descriptionLength.min, descriptionLength.max));
    }
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.description = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.setRenumeration = async (context) => {
    if (Array.isArray(context.inputData)) {
        throw new Error(labels.imgInRenumerationError[context.lang]);
    }
    const validationResult = userInputData.ifStrCondition(
        context.inputData,
        remunerationLength,
        // eslint-disable-next-line security/detect-non-literal-regexp
        new RegExp(regExpForAd)
    );
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](remunerationLength.min, remunerationLength.max));
    }
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.renumeration = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.setCategory = async (context) => {
    const validationResult = userInputData.ifStrContain(context.inputData, strArrForCategory);
    if (validationResult) {
        throw new Error(categoryError[context.lang]);
    }
    const ad = { author: context.user.id, category: context.inputData };
    const adId = await createAdvertisement(ad);
    context.userState.currentUpdateAd = adId;
};

exports.setImg = async (context) => {
    if (!Array.isArray(context.inputData)) {
        throw new Error(labels.imgError[context.lang]);
    }
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.imgId = context.inputData[0].file_id;
    await updateAdState(ad._id, ad);
};

exports.publish = async (context) => {
    const user = await findUser(context.user.id);
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.location = {
        ...user.location
    };
    ad.isActive = context.inputData === commands.PUBLISH_AD.title[context.lang];
    await updateAdState(ad._id, ad);
    return new Sticker('CAACAgIAAxkBAAEBpQlfxxPlTI2Gx6UKeQ5b0FXJW0yQ7wAC63cBAAFji0YMzAFrUki69PseBA').get();
};

exports.cancel = async (context) => {
    await deleteAd(context.userState.currentUpdateAd);
    return new Sticker('CAACAgIAAxkBAAEBpRFfxxYEAwwAAUcOC8pQeftsyqCsPZUAAvN3AQABY4tGDLoxyUviSr8AAR4E').get();
};
