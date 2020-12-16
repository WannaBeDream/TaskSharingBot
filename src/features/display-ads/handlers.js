const { Text } = require('claudia-bot-builder').telegramTemplate;

const labels = require('./labels');
const commands = require('./commands');
const adCategories = require('../ad-categories');
const { GO_BACK: backCommand } = require('../general-commands');
const { AD_TEMPLATE } = require('../ad-template');
const { SPAM_COUNTER } = require('../../constants/db-values');
const validator = require('../../validators/ad-validation').userInputData;
const { categoryError } = require('../validations-labels');
const { strArrForCategoryAll } = require('../../constants/ad-values');
const { ADS_PAGE_SIZE } = require('../../constants/db-values');
const CustomException = require('../../helpers/exeptions');

const adsFindFunctions = require('../../database/methods/find');
const adsUpdateFuntions = require('../../database/methods/update');
const { deleteAd } = require('../../database/methods/delete');

const telmsg = require('../../helpers/tel-message-utils');

const adsViewModes = {
    LOCAL_ADS_MODE: 'localAdsMode',
    SELECTED_ADS_MODE: 'selectedAdsMode',
    OWN_ADS_MODE: 'ownAdsMode'
};

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.renderSelectAdsCategoryView = (context) => {
    return new Text(labels.selectAdsCategory[context.lang])
        .addReplyKeyboard(
            [
                [adCategories.ASSISTANCE_SEARCH.title[context.lang], adCategories.BUY_STUFF.title[context.lang]],
                [adCategories.SERVICES_OFFER.title[context.lang], adCategories.SALES.title[context.lang]],
                [
                    backCommand.title[context.lang],
                    adCategories.LOST_FOUND_ADS.title[context.lang],
                    adCategories.ALL.title[context.lang]
                ]
            ],
            true
        )
        .get();
};

function sendAds(context, foundAdsTemplates) {
    const page = context.userStateDataHolder.data.adsPage;
    const offset = page * ADS_PAGE_SIZE;
    const { numberOfPages } = context.tmpStateDataHolder.data;
    const navLine1 = [
        ...(page > 0 ? [commands.NEWER_ADS.title[context.lang]] : []),
        ...(page < numberOfPages - 1 ? [commands.OLDER_ADS.title[context.lang]] : [])
    ];
    const navLine2 = [commands.GO_HOME.title[context.lang]];
    const navFull = navLine1 ? [navLine1, navLine2] : [navLine2];

    if (foundAdsTemplates.length > 0) {
        const end = numberOfPages === page + 1 ? offset + foundAdsTemplates.length : offset + ADS_PAGE_SIZE;
        return [
            new Text(labels.pageNumber[context.lang](page + 1))
                .addReplyKeyboard([[commands.GO_HOME.title[context.lang]]], true)
                .get(),
            ...foundAdsTemplates,
            new Text(labels.foundAdsRange[context.lang](offset + 1, end)).addReplyKeyboard(navFull, true).get()
        ];
    }
    return new Text(labels.ifEmptyArrayMessage[context.lang]).addReplyKeyboard(navFull, true).get();
}

exports.renderFoundAdsView = (context) => {
    const viewMode = context.userStateDataHolder.data.adsViewMode;
    const adsList = context.tmpStateDataHolder.data.foundAds.map((ad) => {
        const inlineButtons = [];
        if (viewMode === adsViewModes.OWN_ADS_MODE) {
            if (ad.spam.length >= SPAM_COUNTER) {
                inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.INSTANT_DELETE, context.lang));
            } else {
                const activateCmd = ad.isActive ? commands.DEACTIVATE_AD : commands.ACTIVATE_AD;
                inlineButtons.push(telmsg.buildInlineButton(ad._id, activateCmd, context.lang));
                inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.EDIT_AD, context.lang));
                inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.DELETE_REQUEST, context.lang));
            }
        } else if (viewMode === adsViewModes.LOCAL_ADS_MODE) {
            const favCmd = ad.usersSaved.includes(context.user.id) ? commands.REMOVE_FROM_FAV : commands.ADD_TO_FAV;
            inlineButtons.push(telmsg.buildInlineButton(ad._id, favCmd, context.lang));
            inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.REPORT_REQUEST, context.lang));
        } else {
            inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.REMOVE_FROM_FAV, context.lang));
        }

        if (!ad.imgId) {
            return new Text(AD_TEMPLATE(ad, context.lang)).addInlineKeyboard([inlineButtons]).get();
        }
        return telmsg.sendPhoto(ad.imgId, AD_TEMPLATE(ad, context.lang), [inlineButtons], true);
    });
    return sendAds(context, adsList);
};

// ////////////////////////////////////////////////// //
//                  Search logic                      //
// ////////////////////////////////////////////////// //

exports.startLocalAdsSearch = (context) => {
    context.userStateDataHolder.data = { adsViewMode: adsViewModes.LOCAL_ADS_MODE, adsPage: 0 };
};

function buildLocalAdsCriteria(context) {
    return {
        category: context.userStateDataHolder.data.adsCategory,
        location: {
            latitude: context.user.location.coordinates[1],
            longitude: context.user.location.coordinates[0]
        },
        radius: context.user.searchRadius,
        active: true,
        user: context.user.id,
        page: context.userStateDataHolder.data.adsPage
    };
}

function buildOwnAdsCriteria(context) {
    return {
        author: context.user.id,
        page: context.userStateDataHolder.data.adsPage
    };
}

function buildSelectedAdsCriteria(context) {
    return {
        user: context.user.id,
        page: context.userStateDataHolder.data.adsPage
    };
}

async function searchAdsByContextState(context) {
    const viewMode = context.userStateDataHolder.data.adsViewMode;
    const criteria = {
        ...(viewMode === adsViewModes.LOCAL_ADS_MODE ? buildLocalAdsCriteria(context) : {}),
        ...(viewMode === adsViewModes.OWN_ADS_MODE ? buildOwnAdsCriteria(context) : {}),
        ...(viewMode === adsViewModes.SELECTED_ADS_MODE ? buildSelectedAdsCriteria(context) : {})
    };
    const result = await adsFindFunctions.findAdsByCriteria(criteria);
    context.tmpStateDataHolder.data = {
        numberOfPages: result.numberOfPages,
        foundAds: result.adsSlice.reverse()
    };
}

exports.searchLocalAds = async (context) => {
    if (validator.ifStrContain(context.inputData, strArrForCategoryAll)) {
        throw new CustomException(categoryError[context.lang]);
    }
    context.userStateDataHolder.data = {
        adsViewMode: adsViewModes.LOCAL_ADS_MODE,
        adsCategory: context.inputData === adCategories.ALL.id ? null : context.inputData,
        adsPage: 0
    };
    await searchAdsByContextState(context);
};
exports.searchOwnAds = async (context) => {
    context.userStateDataHolder.data = { adsViewMode: adsViewModes.OWN_ADS_MODE, adsPage: 0 };
    await searchAdsByContextState(context);
};
exports.searchSelectedAds = async (context) => {
    context.userStateDataHolder.data = { adsViewMode: adsViewModes.SELECTED_ADS_MODE, adsPage: 0 };
    await searchAdsByContextState(context);
};
exports.searchOlderAds = async (context) => {
    context.userStateDataHolder.data.adsPage += 1;
    await searchAdsByContextState(context);
};
exports.searchNewerAds = async (context) => {
    context.userStateDataHolder.data.adsPage -= 1;
    await searchAdsByContextState(context);
};

// ////////////////////////////////////////////////// //
//           Inline buttons generators                //
// ////////////////////////////////////////////////// //

function getOwnAdActions(isAdActive) {
    return [isAdActive ? commands.DEACTIVATE_AD : commands.ACTIVATE_AD, commands.EDIT_AD, commands.DELETE_REQUEST];
}

function getFavAdActions(isAdFav) {
    return [isAdFav ? commands.ADD_TO_FAV : commands.REMOVE_FROM_FAV, commands.REPORT_REQUEST];
}

// ////////////////////////////////////////////////// //
//            Inline actions ALL ads                  //
// ////////////////////////////////////////////////// //

exports.addToSaved = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    await adsUpdateFuntions.addToSavedAds(context.user.id, adId);
    return telmsg.editChatMessageActions(chatData, lang, getFavAdActions(false), adId);
};
exports.deleteFromSaved = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    const ad = await adsUpdateFuntions.deleteFromSavedAds(context.user.id, adId);
    if (!ad.author && ad.usersSaved.length === 0) {
        await deleteAd(adId);
    }
    return context.userStateDataHolder.data.adsViewMode === adsViewModes.SELECTED_ADS_MODE
        ? telmsg.deleteChatMessage(chatData)
        : telmsg.editChatMessageActions(chatData, lang, getFavAdActions(true), adId);
};

exports.requestReportAd = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    const actions = [commands.CANCEL_REPORT, commands.CONFIRM_REPORT];
    const ad = await adsFindFunctions.findAdvertisement(adId);
    return telmsg.editAdContent(chatData, lang, labels.reportAdConfirmation, actions, ad);
};
exports.cancelReportAd = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    const ad = await adsFindFunctions.findAdvertisement(adId);
    const actions = getFavAdActions(!ad.usersSaved.includes(context.user.id));
    return telmsg.editAdContent(chatData, lang, AD_TEMPLATE(ad, lang), actions, ad);
};
exports.confirmReportAd = async (context) => {
    const { chatData, inputData: adId } = context;
    await adsUpdateFuntions.markAsSpam(context.user.id, adId);
    return telmsg.deleteChatMessage(chatData);
};

// ////////////////////////////////////////////////// //
//            Inline actions  MY ads                  //
// ////////////////////////////////////////////////// //

exports.requestDeleteAd = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    const actions = [commands.CANCEL_DELETE, commands.CONFIRM_DELETE];
    const ad = await adsFindFunctions.findAdvertisement(adId);
    return telmsg.editAdContent(chatData, lang, labels.deleteAdConfirmation, actions, ad);
};
exports.cancelDeleteAd = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    const ad = await adsFindFunctions.findAdvertisement(adId);
    return telmsg.editAdContent(chatData, lang, AD_TEMPLATE(ad, lang), getOwnAdActions(ad.isActive), ad);
};
exports.confirmDeleteAd = async (context) => {
    const { chatData, inputData: adId } = context;
    const ad = await adsFindFunctions.findAdvertisement(adId);
    if (ad.usersSaved.length > 0) {
        ad.author = null;
        ad.isActive = false;
        await adsUpdateFuntions.updateAdState(adId, ad);
    } else {
        await deleteAd(adId);
    }
    return telmsg.deleteChatMessage(chatData);
};

exports.deactivateAd = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    await adsUpdateFuntions.updateAdActiveStatus(adId, false);
    return telmsg.editChatMessageActions(chatData, lang, getOwnAdActions(false), adId, labels.deactivateIsSet);
};
exports.activateAd = async (context) => {
    const { chatData, lang, inputData: adId } = context;
    await adsUpdateFuntions.updateAdActiveStatus(adId, true);
    return telmsg.editChatMessageActions(chatData, lang, getOwnAdActions(true), adId, labels.activateIsSet);
};
