const { Text } = require('claudia-bot-builder').telegramTemplate;

const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const generalCms = require('../general-commands');
const { AD_TEMPLATE } = require('../ad-template');

const { findAdvertisement, findUser } = require('../../database/methods/find');
const { createAdvertisement } = require('../../database/methods/create');
const { updateAdState } = require('../../database/methods/update');
const { userInputData } = require('../../validators/ad-validation');
const { checkMaxMinReg, categoryError } = require('../validations-labels');
const { titleLength, descriptionLength, remunerationLength, strArrForCategory } = require('../../constants/ad-values');
const { deleteAd } = require('../../database/methods/delete');
const telmsg = require('../../helpers/tel-message-utils');

// ////////////////////////////////////////////////// //
//                  Display messages                  //
// ////////////////////////////////////////////////// //

exports.renderSetAdTitleView = (context) => {
    return new Text(labels.newUserSetAdTitleView[context.lang]).replyKeyboardHide().get();
};

exports.renderSetAdDescriptionView = (context) => {
    return new Text(labels.newUserSetAdDescriptionView[context.lang]).get();
};

exports.renderSetAdRemunerationView = (context) => {
    return new Text(labels.newUserEnterRenumeration[context.lang])
        .addReplyKeyboard([[generalCms.SKIP.title[context.lang]]], true)
        .get();
};

exports.renderSetAdCategoryView = (context) => {
    return new Text(labels.newUserSetAdCategotyView[context.lang])
        .addReplyKeyboard(
            [
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [generalCms.GO_BACK.title[context.lang], inputCms.LOST_FOUND_ADS.title[context.lang]]
            ],
            true
        )
        .get();
};

exports.renderSetAdImgView = (context) => {
    return new Text(labels.newUserEnterImg[context.lang])
        .addReplyKeyboard([[generalCms.SKIP.title[context.lang]]], true)
        .get();
};

exports.renderPreviewAdView = async (context) => {
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    const previewActions = [[commands.CANCEL_AD.title[context.lang], commands.PUBLISH_AD.title[context.lang]]];
    if (!ad.imgId) {
        return new Text(AD_TEMPLATE(ad, context.lang)).addReplyKeyboard(previewActions, true).get();
    }
    return telmsg.sendPhoto(ad.imgId, AD_TEMPLATE(ad, context.lang), previewActions);
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setTitle = async (context) => {
    const { inputData } = context;

    if (typeof inputData !== 'string' || inputData === '') {
        throw new Error(labels.titleError[context.lang]);
    }
    if (userInputData.ifStrCondition(inputData, titleLength)) {
        throw new Error(checkMaxMinReg[context.lang](titleLength.min, titleLength.max));
    }

    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.title = inputData;
    await updateAdState(ad._id, ad);
};

exports.setDescription = async (context) => {
    const { inputData } = context;

    if (typeof inputData !== 'string' || inputData === '') {
        throw new Error(labels.descriptionError[context.lang]);
    }
    if (userInputData.ifStrCondition(inputData, descriptionLength)) {
        throw new Error(checkMaxMinReg[context.lang](descriptionLength.min, descriptionLength.max));
    }

    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.description = inputData;
    await updateAdState(ad._id, ad);
};

exports.setRenumeration = async (context) => {
    const { inputData } = context;

    if (Array.isArray(inputData)) {
        throw new Error(labels.imgInRenumerationError[context.lang]);
    }
    if (typeof inputData !== 'string' || inputData === '') {
        throw new Error(labels.renumerationError[context.lang]);
    }
    if (userInputData.ifStrCondition(inputData, remunerationLength)) {
        throw new Error(checkMaxMinReg[context.lang](remunerationLength.min, remunerationLength.max));
    }

    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    ad.renumeration = inputData;
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
    ad.location = { ...user.location };
    ad.isActive = true;
    await updateAdState(ad._id, ad);
    context.userState.currentUpdateAd = null;
    return new Text(labels.publish[context.lang]).get();
};

exports.cancelSettingAd = async (context) => {
    await deleteAd(context.userState.currentUpdateAd);
    context.userState.currentUpdateAd = null;
    return new Text(labels.cancel[context.lang]).get();
};
