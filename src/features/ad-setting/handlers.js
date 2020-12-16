const { Text } = require('claudia-bot-builder').telegramTemplate;

const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const generalCms = require('../general-commands');
const { AD_TEMPLATE } = require('../ad-template');

const { findAdvertisement, findUser } = require('../../database/methods/find');
const { createAdvertisement } = require('../../database/methods/create');
const updateMethods = require('../../database/methods/update');
const validator = require('../../validators/ad-validation').userInputData;
const { checkMaxMinReg, categoryError } = require('../validations-labels');
const { titleLength, descriptionLength, remunerationLength, strArrForCategory } = require('../../constants/ad-values');
const { deleteAd } = require('../../database/methods/delete');
const telmsg = require('../../helpers/tel-message-utils');
const CustomException = require('../../helpers/exeptions');

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
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
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
    const title = context.inputData;

    if (typeof title !== 'string' || title === '') {
        throw new CustomException(labels.titleError[context.lang]);
    }
    if (validator.ifStrCondition(title, titleLength)) {
        throw new CustomException(checkMaxMinReg[context.lang](titleLength.min, titleLength.max));
    }

    await updateMethods.updateAdTitle(context.userStateDataHolder.data.currentUpdateAd, title);
};

exports.setDescription = async (context) => {
    const description = context.inputData;

    if (typeof description !== 'string' || description === '') {
        throw new CustomException(labels.descriptionError[context.lang]);
    }
    if (validator.ifStrCondition(description, descriptionLength)) {
        throw new CustomException(checkMaxMinReg[context.lang](descriptionLength.min, descriptionLength.max));
    }

    await updateMethods.updateAdDescription(context.userStateDataHolder.data.currentUpdateAd, description);
};

exports.setRenumeration = async (context) => {
    const renumeration = context.inputData;

    if (Array.isArray(renumeration)) {
        throw new CustomException(labels.imgInRenumerationError[context.lang]);
    }
    if (typeof renumeration !== 'string' || renumeration === '') {
        throw new CustomException(labels.renumerationError[context.lang]);
    }
    if (validator.ifStrCondition(renumeration, remunerationLength)) {
        throw new CustomException(checkMaxMinReg[context.lang](remunerationLength.min, remunerationLength.max));
    }

    await updateMethods.updateAdRemuneration(context.userStateDataHolder.data.currentUpdateAd, renumeration);
};

exports.setCategory = async (context) => {
    const validationResult = validator.ifStrContain(context.inputData, strArrForCategory);

    if (validationResult) {
        throw new CustomException(categoryError[context.lang]);
    }

    const ad = { author: context.user.id, category: context.inputData };
    const adId = await createAdvertisement(ad);
    context.userStateDataHolder.data = { currentUpdateAd: adId };
};

exports.setImg = async (context) => {
    const image = context.inputData;
    if (!Array.isArray(image)) {
        throw new CustomException(labels.imgError[context.lang]);
    }
    const imgId = image[0].file_id;
    await updateMethods.updateAdImage(context.userStateDataHolder.data.currentUpdateAd, imgId);
};

exports.publish = async (context) => {
    const user = await findUser(context.user.id);
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
    ad.location = { ...user.location };
    ad.isActive = true;
    await updateMethods.updateAdState(ad._id, ad);
    context.userStateDataHolder.data = null;
    return new Text(labels.publish[context.lang]).get();
};

exports.cancelSettingAd = async (context) => {
    await deleteAd(context.userStateDataHolder.data.currentUpdateAd);
    context.userStateDataHolder.data = null;
    return new Text(labels.cancel[context.lang]).get();
};
