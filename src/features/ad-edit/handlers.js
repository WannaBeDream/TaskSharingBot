const { Text, Photo } = require('claudia-bot-builder').telegramTemplate;

const { AD_TEMPLATE } = require('../ad-template');
const { findAdAndReturnOneField, findAdvertisement } = require('../../database/methods/find');
const {
    updateTitleAd,
    updateDescriptionAd,
    updateCategoryAd,
    updateRemunerationAd,
    updateImageAd
} = require('../../database/methods/update');
const { userInputData } = require('../../validators/ad-create-validation');
const { checkMaxMinReg, checkMatchWords } = require('../validations-labels');
const {
    titleLength,
    descriptionLength,
    remunerationLength,
    regExpForAd,
    regExpForCategory
} = require('../../constants/ad-values');
const { SKIP: skipCommand } = require('../general-commands');
const { FINISH_EDITING: finishCommand } = require('./commands');
const labels = require('./labels');
const inputCms = require('../ad-categories');
const markdownUtils = require('../../helpers/markdown-utils');

exports.initChangeTitleAdView = async (context) => {
    const { title } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'title');
    const message = `${labels.editTitle[context.lang]}\n${markdownUtils.formatItalicText(title)}`;
    return new Text(message).addReplyKeyboard([[skipCommand.title[context.lang]]], true).get();
};

exports.initChangeDescriptionAdView = async (context) => {
    const { description } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'description');
    const message = `${labels.editDescription[context.lang]}\n${markdownUtils.formatItalicText(description)}`;
    return new Text(message).get();
};

exports.initChangeCategoryAdView = async (context) => {
    const { category } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'category');
    const categoryText = Object.values(inputCms).find((cmd) => cmd.id === category).title[context.lang];
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

exports.initChangeImageAdView = async (context) => {
    const { imgId } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'imgId');
    let message;

    if (imgId) {
        message = `${labels.editWithImage[context.lang]}`;
        return [new Photo(imgId).get(), new Text(message).get()];
    }

    message = labels.editWithoutImage[context.lang];
    return new Text(message).get();
};

exports.initChangeRemunerationAdView = async (context) => {
    const { renumeration } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'renumeration');
    let message;

    if (renumeration === null) {
        message = labels.editRemunerationWithoutData[context.lang];
        return new Text(message).get();
    }

    message = `${labels.editRemunerationWithData[context.lang]}\n${markdownUtils.formatItalicText(renumeration)}`;
    return new Text(message).get();
};

exports.initFinishEditingAdView = async (context) => {
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    const adTemplate = new Text(AD_TEMPLATE(ad, context.lang));

    if (ad.imgId) {
        return [
            new Photo(ad.imgId).get(),
            adTemplate.addReplyKeyboard([[finishCommand.title[context.lang]]], true).get()
        ];
    }

    return adTemplate.addReplyKeyboard([[finishCommand.title[context.lang]]], true).get();
};

exports.updateTitle = async (context) => {
    const { inputData } = context;

    if (Array.isArray(inputData)) {
        throw new Error(labels.titleError[context.lang]);
    }
    if (userInputData.ifStrCondition(inputData, titleLength, regExpForAd.app)) {
        throw new Error(checkMaxMinReg[context.lang](titleLength.min, titleLength.max));
    }

    await updateTitleAd(context.userState.currentUpdateAd, inputData);
};

exports.updateDescription = async (context) => {
    const { inputData } = context;

    if (Array.isArray(inputData)) {
        throw new Error(labels.descriptionError[context.lang]);
    }
    if (userInputData.ifStrCondition(inputData, descriptionLength, regExpForAd.app)) {
        throw new Error(checkMaxMinReg[context.lang](descriptionLength.min, descriptionLength.max));
    }

    await updateDescriptionAd(context.userState.currentUpdateAd, inputData);
};

// ! TODO: доробити
exports.updateCategory = async (context) => {
    const { inputData } = context;

    const validationResult = userInputData.ifStrContain(inputData, regExpForCategory);
    if (validationResult) {
        throw new Error(checkMatchWords[context.lang]);
    }

    await updateCategoryAd(context.userState.currentUpdateAd, inputData);
};

// ! TODO: доробити
exports.updateImage = async (context) => {
    console.log('=============================  updateImage  =============================');
    console.log(context);
    console.log('=============================  updateImage  =============================');

    const { inputData } = context;
    // const notImage = typeof inputData[0].file_id === 'undefined';
    // if (!Array.isArray(inputData) || notImage) {
    //     throw new Error(labels.imgError[context.lang]);
    // }

    const imgId = inputData[0].file_id;
    await updateImageAd(context.userState.currentUpdateAd, imgId);
};

exports.updateRemuneration = async (context) => {
    const { inputData } = context;

    if (Array.isArray(inputData)) {
        throw new Error(labels.imgErrorInRemuneration[context.lang]);
    }
    if (userInputData.ifStrCondition(inputData, remunerationLength, regExpForAd.app)) {
        throw new Error(checkMaxMinReg[context.lang](remunerationLength.min, remunerationLength.max));
    }

    await updateRemunerationAd(context.userState.currentUpdateAd, inputData);
};
