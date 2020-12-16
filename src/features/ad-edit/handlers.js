const { Text, Photo } = require('claudia-bot-builder').telegramTemplate;

const { AD_TEMPLATE } = require('../ad-template');
const { findAdvertisement } = require('../../database/methods/find');
const updateMethods = require('../../database/methods/update');
const validator = require('../../validators/ad-validation').userInputData;
const { checkMaxMinReg, categoryError } = require('../validations-labels');
const { titleLength, descriptionLength, remunerationLength, strArrForCategory } = require('../../constants/ad-values');
const { SKIP: skipCommand } = require('../general-commands');
const { FINISH_EDITING: finishCommand } = require('./commands');
const labels = require('./labels');
const inputCms = require('../ad-categories');
const markdownUtils = require('../../helpers/markdown-utils');
const telmsg = require('../../helpers/tel-message-utils');
const CustomException = require('../../helpers/exeptions');

exports.startEditAd = (context) => {
    context.userStateDataHolder.data = { currentUpdateAd: context.inputData };
    return telmsg.answerCallbackQuery(context.chatData.callbackQueryId, labels.editAdIsStarted[context.lang]);
};

exports.renderChangeAdTitleView = async (context) => {
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
    const message = `${labels.editTitle[context.lang]}\n${markdownUtils.formatItalicText(ad.title)}`;
    return new Text(message).addReplyKeyboard([[skipCommand.title[context.lang]]], true).get();
};

exports.renderChangeAdDescriptionView = async (context) => {
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
    const message = `${labels.editDescription[context.lang]}\n${markdownUtils.formatItalicText(ad.description)}`;
    return new Text(message).get();
};

exports.renderChangeAdCategoryView = async (context) => {
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
    const categoryText = Object.values(inputCms).find((cmd) => cmd.id === ad.category).title[context.lang];
    const message = `${labels.editCategory[context.lang]}\n${markdownUtils.formatItalicText(categoryText)}`;
    return new Text(message)
        .addReplyKeyboard(
            [
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [inputCms.LOST_FOUND_ADS.title[context.lang], skipCommand.title[context.lang]]
            ],
            true
        )
        .get();
};

exports.renderChangeAdImageView = async (context) => {
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
    if (ad.imgId) {
        return [new Photo(ad.imgId).get(), new Text(labels.editWithImage[context.lang]).get()];
    }
    return new Text(labels.editWithoutImage[context.lang]).get();
};

exports.renderChangeAdRemunerationView = async (context) => {
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);
    if (ad.renumeration.length === 0) {
        return new Text(labels.enterRemuneration[context.lang]).get();
    }

    const message = `${labels.editRemuneration[context.lang]}\n${markdownUtils.formatItalicText(ad.renumeration)}`;
    return new Text(message).get();
};

exports.renderFinishAdEditingView = async (context) => {
    const ad = await findAdvertisement(context.userStateDataHolder.data.currentUpdateAd);

    if (ad.imgId) {
        return telmsg.sendPhoto(ad.imgId, AD_TEMPLATE(ad, context.lang), [[finishCommand.title[context.lang]]]);
    }

    return new Text(AD_TEMPLATE(ad, context.lang)).addReplyKeyboard([[finishCommand.title[context.lang]]], true).get();
};

exports.updateTitle = async (context) => {
    const title = context.inputData;

    if (typeof title !== 'string' || title === '') {
        throw new CustomException(labels.titleError[context.lang]);
    }
    if (validator.ifStrCondition(title, titleLength)) {
        throw new CustomException(checkMaxMinReg[context.lang](titleLength.min, titleLength.max));
    }

    await updateMethods.updateAdTitle(context.userStateDataHolder.data.currentUpdateAd, title);
};

exports.updateDescription = async (context) => {
    const description = context.inputData;

    if (typeof description !== 'string' || description === '') {
        throw new CustomException(labels.descriptionError[context.lang]);
    }
    if (validator.ifStrCondition(description, descriptionLength)) {
        throw new CustomException(checkMaxMinReg[context.lang](descriptionLength.min, descriptionLength.max));
    }

    await updateMethods.updateAdDescription(context.userStateDataHolder.data.currentUpdateAd, description);
};

exports.updateCategory = async (context) => {
    const category = context.inputData;
    const validationResult = validator.ifStrContain(category, strArrForCategory);

    if (validationResult) {
        throw new CustomException(categoryError[context.lang]);
    }

    await updateMethods.updateAdCategory(context.userStateDataHolder.data.currentUpdateAd, category);
};

exports.updateImage = async (context) => {
    const image = context.inputData;
    if (!Array.isArray(image)) {
        throw new CustomException(labels.imgError[context.lang]);
    }
    const imgId = image[0].file_id;
    await updateMethods.updateAdImage(context.userStateDataHolder.data.currentUpdateAd, imgId);
};

exports.updateRemuneration = async (context) => {
    const renumeration = context.inputData;

    if (Array.isArray(renumeration)) {
        throw new CustomException(labels.imgErrorInRemuneration[context.lang]);
    }
    if (typeof renumeration !== 'string' || renumeration === '') {
        throw new CustomException(labels.renumerationError[context.lang]);
    }
    if (validator.ifStrCondition(renumeration, remunerationLength)) {
        throw new CustomException(checkMaxMinReg[context.lang](remunerationLength.min, remunerationLength.max));
    }

    await updateMethods.updateAdRemuneration(context.userStateDataHolder.data.currentUpdateAd, renumeration);
};

exports.finishEditing = (context) => {
    context.userStateDataHolder.data = null;
};
