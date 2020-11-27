/* eslint-disable no-underscore-dangle */
const { Text } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const { AD_TEMPLATE } = require('../ad-template');

const { findAdvertisement, findUser } = require('../../database/find');
const { createAdvertisement } = require('../../database/create');
const { updateAdState } = require('../../database/update');
const { validators } = require('../../helpers/validators');
const { checkMaxMinReg } = require('../../helpers/validators/labels');
const {
    longSmallTitleValue,
    longSmallDescriptionValue,
    longSmallRenumerationValue,
    regExpForAdv
} = require('../../helpers/validators/constants');
const { logger } = require('../../helpers');

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
    return new Text(labels.newUserEnterRenumeration[context.lang]).replyKeyboardHide().get();
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

exports.userPublishAdView = async (context) => {
    const ad = await findAdvertisement(context.user.id);
    return new Text(AD_TEMPLATE(ad, context.lang))
        .addReplyKeyboard([[commands.CANCEL_AD.title[context.lang]], [commands.PUBLISH_AD.title[context.lang]]], true)
        .get();
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setTitle = async (context) => {
    const validationResult = await validators.ifStrCondition(context.inputData, longSmallTitleValue, regExpForAdv.app);
    if (validationResult) {
        logger.error(validationResult);
        throw new Error(checkMaxMinReg[context.lang](longSmallTitleValue.min, longSmallTitleValue.max));
    }
    const ad = { author: context.user.id, title: context.inputData };
    await createAdvertisement(ad);
};

exports.setDescription = async (context) => {
    const validationResult = await validators.ifStrCondition(
        context.inputData,
        longSmallDescriptionValue,
        regExpForAdv.app
    );
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](longSmallDescriptionValue.min, longSmallDescriptionValue.max));
    }
    const ad = await findAdvertisement(context.user.id);
    ad.description = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.setRenumeration = async (context) => {
    const validationResult = await validators.ifStrCondition(
        context.inputData,
        longSmallRenumerationValue,
        regExpForAdv.app
    );
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](longSmallRenumerationValue.min, longSmallRenumerationValue.max));
    }
    const ad = await findAdvertisement(context.user.id);
    ad.renumeration = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.setCategory = async (context) => {
    const ad = await findAdvertisement(context.user.id);
    ad.category = context.inputData;
    await updateAdState(ad._id, ad);
};

exports.publish = async (context) => {
    const user = await findUser(context.user.id);
    const ad = await findAdvertisement(context.user.id);
    ad.location = {
        ...user.location
    };
    ad.isActive = context.inputData === commands.PUBLISH_AD.title[context.lang];
    await updateAdState(ad._id, ad);
    return new Text(`👌🏿`).get();
};

exports.cancel = () => {
    return new Text(`👌🏿`).get();
};
