/* eslint-disable no-underscore-dangle */
const { Text, Photo } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const { AD_TEMPLATE } = require('../ad-template');

const { findAdvertisement, findUser } = require('../../database/methods/find');
const { createAdvertisement } = require('../../database/methods/create');
const { updateAdState } = require('../../database/methods/update');
const { userInputData } = require('../../validators/ad-create-validation');
const { checkMaxMinReg, checkMatchWords } = require('../validations-labels');
const {
    titleLength,
    descriptionLength,
    remunerationLength,
    regExpForAd,
    regExpForCategory
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
        .addReplyKeyboard([[inputCms.SKIP.title[context.lang]]], true)
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
        .addReplyKeyboard([[inputCms.SKIP.title[context.lang]]], true)
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
    return [
        new Photo(ad.imgId, ad.title).get(),
        new Text(AD_TEMPLATE(ad, context.lang))
            .addReplyKeyboard(
                [[commands.CANCEL_AD.title[context.lang]], [commands.PUBLISH_AD.title[context.lang]]],
                true
            )
            .get()
    ];
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setTitle = async (context) => {
    const validationResult = userInputData.ifStrCondition(context.inputData, titleLength, regExpForAd.app);
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](titleLength.min, titleLength.max));
    }
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.title = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.setDescription = async (context) => {
    const validationResult = userInputData.ifStrCondition(context.inputData, descriptionLength, regExpForAd.app);
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
    const validationResult = userInputData.ifStrCondition(context.inputData, remunerationLength, regExpForAd.app);
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](remunerationLength.min, remunerationLength.max));
    }
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.renumeration = context.inputData !== inputCms.SKIP.id ? context.inputData : null;
    await updateAdState(ad._id, ad);
};

exports.setCategory = async (context) => {
    const validationResult = userInputData.ifStrContain(context.inputData, regExpForCategory);
    if (validationResult) {
        throw new Error(checkMatchWords[context.lang]);
    }
    const ad = { author: context.user.id, category: context.inputData };
    const adId = await createAdvertisement(ad);
    context.userState.currentUpdateAd = adId;
};

exports.setImg = async (context) => {
    if (context.inputData !== inputCms.SKIP.id && !Array.isArray(context.inputData)) {
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
    return new Text(`👌🏿`).get();
};

exports.cancel = async (context) => {
    await deleteAd(context.userState.currentUpdateAd);
    return new Text(`👌🏿`).get();
};
