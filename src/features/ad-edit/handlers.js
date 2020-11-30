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
const command = require('./commands');
const labels = require('./labels');
const inputCms = require('../ad-categories');
const { logger } = require('../../helpers');

const { userInputData } = require('../../validators/user-input-data');
const { checkMaxMinReg } = require('../../validators/user-input-data/labels');
const {
    longSmallTitleValue,
    longSmallDescriptionValue,
    regExpForAdv
} = require('../../validators/user-input-data/constants');

exports.initChangeTitleAdView = async (context) => {
    const { title } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'title');
    const message = `${labels.editTitle[context.lang]} ${title}`;
    return new Text(message).addReplyKeyboard([[command.SKIP.title[context.lang]]], true).get();
};

exports.initChangeDescriptionAdView = async (context) => {
    const { description } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'description');
    const message = `${labels.editDescription[context.lang]} ${description}`;
    return new Text(message).get();
};

exports.initChangeCategoryAdView = async (context) => {
    const { category } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'category');
    let categoryText;

    switch (category) {
        case 'lostFoundAds':
            categoryText = inputCms.LOST_FOUND_ADS.title[context.lang];
            break;
        case 'sales':
            categoryText = inputCms.SALES.title[context.lang];
            break;
        case 'servicesOffer':
            categoryText = inputCms.SERVICES_OFFER.title[context.lang];
            break;
        case 'assistanceSearch':
            categoryText = inputCms.ASSISTANCE_SEARCH.title[context.lang];
            break;
        case 'buyStuff':
            categoryText = inputCms.BUY_STUFF.title[context.lang];
            break;
        default:
            categoryText = category;
            break;
    }

    const message = `${labels.editCategory[context.lang]} ${categoryText}`;
    return new Text(message)
        .addReplyKeyboard(
            [
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [command.SKIP.title[context.lang], inputCms.LOST_FOUND_ADS.title[context.lang]]
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
        return [
            new Photo(imgId).get(),
            new Text(message).addReplyKeyboard([[command.SKIP.title[context.lang]]], true).get()
        ];
    }

    message = labels.editWithoutImage[context.lang];
    return new Text(message).addReplyKeyboard([[command.SKIP.title[context.lang]]], true).get();
};

exports.initChangeRemunerationAdView = async (context) => {
    const { renumeration } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'renumeration');
    let message;

    if (renumeration === null) {
        message = labels.editRemunerationWithoutData[context.lang];
        return new Text(message).addReplyKeyboard([[command.SKIP.title[context.lang]]], true).get();
    }

    message = `${labels.editRemunerationWithData[context.lang]} ${renumeration}`;
    return new Text(message).addReplyKeyboard([[command.SKIP.title[context.lang]]], true).get();
};

exports.initFinishEditingAdView = async (context) => {
    const ad = await findAdvertisement(context.userState.currentUpdateAd);
    const adView = new Text(AD_TEMPLATE(ad, context.lang));

    if (ad.imgId) {
        return [
            new Photo(ad.imgId).get(),
            adView.addReplyKeyboard([[command.FINISH_EDITING.title[context.lang]]], true).get()
        ];
    }

    return adView.addReplyKeyboard([[command.FINISH_EDITING.title[context.lang]]], true).get();
};

exports.updateTitle = async (context) => {
    const { inputData } = context;
    const buttonTextEn = command.SKIP.title.en;
    const buttonTextUa = command.SKIP.title.en;
    const validationResult = await userInputData.ifStrCondition(inputData, longSmallTitleValue, regExpForAdv.app);

    if (validationResult) {
        logger.error(validationResult);
        throw new Error(checkMaxMinReg[context.lang](longSmallTitleValue.min, longSmallTitleValue.max));
    }

    if (inputData === buttonTextEn || inputData === buttonTextUa) {
        return;
    }

    await updateTitleAd(context.userState.currentUpdateAd, inputData);
};

exports.updateDescription = async (context) => {
    const validationResult = await userInputData.ifStrCondition(
        context.inputData,
        longSmallDescriptionValue,
        regExpForAdv.app
    );
    if (validationResult) {
        throw new Error(checkMaxMinReg[context.lang](longSmallDescriptionValue.min, longSmallDescriptionValue.max));
    }

    const buttonTextEn = command.SKIP.title.en;
    const buttonTextUa = command.SKIP.title.en;
    const { inputData } = context;
    if (inputData === buttonTextEn || inputData === buttonTextUa) {
        return;
    }
    await updateDescriptionAd(context.userState.currentUpdateAd, inputData);
};

exports.updateCategory = async (context) => {
    const buttonTextEn = command.SKIP.title.en;
    const buttonTextUa = command.SKIP.title.en;
    const { inputData } = context;

    if (inputData === buttonTextEn || inputData === buttonTextUa) {
        return;
    }

    await updateCategoryAd(context.userState.currentUpdateAd, inputData);
};

// ! TODO: доробити
exports.updateImage = async (context) => {
    console.log('=============================  updateImage  =============================');
    console.log(context);
    console.log('=============================  updateImage  =============================');

    const { inputData } = context;
    const buttonTextEn = command.SKIP.title.en;
    const buttonTextUa = command.SKIP.title.en;
    const notImage = typeof inputData[0].file_id === 'undefined';

    if (inputData === buttonTextEn || inputData === buttonTextUa) {
        return;
    }

    if (!Array.isArray(inputData) || notImage) {
        throw new Error(labels.imgError[context.lang]);
    }

    const imgId = inputData[0].file_id;
    await updateImageAd(context.userState.currentUpdateAd, imgId);
};

exports.updateRemuneration = async (context) => {
    const { inputData } = context;
    const buttonTextEn = command.SKIP.title.en;
    const buttonTextUa = command.SKIP.title.en;

    if (Array.isArray(inputData)) {
        throw new Error(labels.imgErrorInRemuneration[context.lang]);
    }

    if (inputData === buttonTextEn || inputData === buttonTextUa) {
        return;
    }
    await updateRemunerationAd(context.userState.currentUpdateAd, inputData);
};
