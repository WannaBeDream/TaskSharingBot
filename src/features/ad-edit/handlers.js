const { Text } = require('claudia-bot-builder').telegramTemplate;

const { AD_TEMPLATE } = require('../ad-template');
const { findAdAndReturnOneField, findAdAndReturn } = require('../../database/find');
const { updateTitleAd, updateDescriptionAd, updateCategoryAd, updateRemunerationAd } = require('../../database/update');
const command = require('./commands');
const labels = require('./labels');
const inputCms = require('../ad-categories');

exports.initChangeTitleAdView = async (context) => {
    const { title } = await findAdAndReturnOneField(context.inputData, 'title');
    const message = `${labels.editTitle[context.lang]} ${title}`;
    return new Text(message).addReplyKeyboard([[command.NEXT_STEP.title[context.lang]]], true).get();
};

exports.initChangeDescriptionAdView = async (context) => {
    const { description } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'description');
    const message = `${labels.editDescription[context.lang]} ${description}`;
    return new Text(message).get();
};

exports.initChangeCategoryAdView = async (context) => {
    const { category } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'category');
    const message = `${labels.editCategory[context.lang]} ${category}`;
    return new Text(message)
        .addReplyKeyboard(
            [
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [command.NEXT_STEP.title[context.lang]]
            ],
            true
        )
        .get();
};

exports.initChangeRemunerationAdView = async (context) => {
    const { renumeration } = await findAdAndReturnOneField(context.userState.currentUpdateAd, 'renumeration');
    const message = `${labels.editRemuneration[context.lang]} ${renumeration}`;
    return new Text(message).addReplyKeyboard([[command.NEXT_STEP.title[context.lang]]], true).get();
};

exports.initFinishEditingAdView = async (context) => {
    const ad = await findAdAndReturn(context.userState.currentUpdateAd);
    const adView = new Text(AD_TEMPLATE(ad, context.lang));
    return adView.addReplyKeyboard([[command.FINISH_EDITING.title[context.lang]]], true).get();
};

exports.updateTitle = async (context) => {
    const buttonText = command.NEXT_STEP.title[context.lang];
    const { inputData } = context;
    if (inputData === buttonText) {
        return;
    }
    await updateTitleAd(context.userState.currentUpdateAd, inputData);
};

exports.updateDescription = async (context) => {
    const buttonText = command.NEXT_STEP.title[context.lang];
    const { inputData } = context;
    if (inputData === buttonText) {
        return;
    }
    await updateDescriptionAd(context.userState.currentUpdateAd, inputData);
};

exports.updateCategory = async (context) => {
    const buttonText = command.NEXT_STEP.title[context.lang];
    const { inputData } = context;
    if (inputData === buttonText) {
        return;
    }
    await updateCategoryAd(context.userState.currentUpdateAd, inputData);
};

exports.updateRemuneration = async (context) => {
    const buttonText = command.NEXT_STEP.title[context.lang];
    const { inputData } = context;
    if (inputData === buttonText) {
        return;
    }
    await updateRemunerationAd(context.userState.currentUpdateAd, inputData);
};
