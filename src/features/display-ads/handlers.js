const { Text } = require('claudia-bot-builder').telegramTemplate;

const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const { GO_BACK: backCommand } = require('../general-commands');
const { unknownCommand: unknownCommandLabel } = require('../unknown-labels');
const { AD_TEMPLATE } = require('../ad-template');
const { SPAM_COUNTER } = require('../../constants/db-values');
const { userInputData } = require('../../validators/ad-validation');
const { categoryError } = require('../validations-labels');
const { strArrForCategoryAll } = require('../../constants/ad-values');
const { ADS_PAGE_SIZE } = require('../../constants/db-values');

const adsDao = require('../../database/methods/find');
const {
    addToSavedAds,
    deleteFromSavedAds,
    markAsSpam,
    updateAdActiveStatus,
    updateAdState
} = require('../../database/methods/update');
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
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [
                    backCommand.title[context.lang],
                    inputCms.LOST_FOUND_ADS.title[context.lang],
                    inputCms.ALL.title[context.lang]
                ]
            ],
            true
        )
        .get();
};

function sendAds(context, foundAdsTemplates) {
    const navLine1 = [
        ...(context.userState.adsPage > 0 ? [commands.NEWER_ADS.title[context.lang]] : []),
        ...(context.userState.adsPage < context.searchResult.numberOfAdsPages - 1
            ? [commands.OLDER_ADS.title[context.lang]]
            : [])
    ];
    const navLine2 = [commands.GO_HOME.title[context.lang]];
    const navFull = navLine1 ? [navLine1, navLine2] : [navLine2];

    if (foundAdsTemplates.length > 0) {
        const page = context.userState.adsPage + 1;
        const start = context.userState.adsPage * ADS_PAGE_SIZE + 1;
        const end =
            context.searchResult.numberOfAdsPages === page
                ? context.userState.adsPage * ADS_PAGE_SIZE + foundAdsTemplates.length
                : context.userState.adsPage * ADS_PAGE_SIZE + ADS_PAGE_SIZE;
        return [
            new Text(labels.pageNumber[context.lang](page))
                .addReplyKeyboard([[commands.GO_HOME.title[context.lang]]], true)
                .get(),
            ...foundAdsTemplates,
            new Text(labels.foundAdsRange[context.lang](start, end)).addReplyKeyboard(navFull, true).get()
        ];
    }
    return new Text(labels.ifEmptyArrayMessage[context.lang]).addReplyKeyboard(navFull, true).get();
}

exports.renderFoundAdsView = (context) => {
    const { adsViewMode } = context.userState;
    const adsList = context.searchResult.foundAds.map((ad) => {
        const inlineButtons = [];
        if (adsViewMode === adsViewModes.OWN_ADS_MODE) {
            if (ad.spam.length >= SPAM_COUNTER) {
                inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.INSTANT_DELETE, context.lang));
            } else {
                const activateCmd = ad.isActive ? commands.DEACTIVATE_AD : commands.ACTIVATE_AD;
                inlineButtons.push(telmsg.buildInlineButton(ad._id, activateCmd, context.lang));
                inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.EDIT_AD, context.lang));
                inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.DELETE_REQUEST, context.lang));
            }
        } else if (adsViewMode === adsViewModes.LOCAL_ADS_MODE) {
            const favCmd = ad.usersSaved.includes(context.user.id) ? commands.REMOVE_FROM_FAV : commands.ADD_TO_FAV;
            inlineButtons.push(telmsg.buildInlineButton(ad._id, favCmd, context.lang));
            inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.REPORT_REQUEST, context.lang));
        } else {
            inlineButtons.push(telmsg.buildInlineButton(ad._id, commands.REMOVE_FROM_FAV, context.lang));
        }

        if (!ad.imgId) {
            return new Text(AD_TEMPLATE(ad, context.lang)).addInlineKeyboard([inlineButtons]).get();
        }
        return telmsg.sendPhoto(ad.imgId, AD_TEMPLATE(ad, context.lang), [inlineButtons]);
    });
    return sendAds(context, adsList);
};

// ////////////////////////////////////////////////// //
//                  Search logic                      //
// ////////////////////////////////////////////////// //

exports.startLocalAdsSearch = (context) => {
    context.userState.adsViewMode = adsViewModes.LOCAL_ADS_MODE;
};

exports.checkChangeCategoryAuthorization = (context) => {
    if (context.userState.adsViewMode !== adsViewModes.LOCAL_ADS_MODE) {
        throw new Error(unknownCommandLabel[context.lang]);
    }
};

function buildLocalAdsCriteria(context) {
    return {
        category: context.userState.adsCategory,
        location: {
            latitude: context.userState.location.coordinates[1],
            longitude: context.userState.location.coordinates[0]
        },
        radius: context.userState.searchRadius,
        active: true,
        user: context.user.id,
        page: context.userState.adsPage
    };
}

function buildOwnAdsCriteria(context) {
    return {
        author: context.user.id,
        page: context.userState.adsPage
    };
}

function buildSelectedAdsCriteria(context) {
    return {
        user: context.user.id,
        page: context.userState.adsPage
    };
}

async function searchAdsByContextState(context) {
    const criteria = {
        ...(context.userState.adsViewMode === adsViewModes.LOCAL_ADS_MODE ? buildLocalAdsCriteria(context) : {}),
        ...(context.userState.adsViewMode === adsViewModes.OWN_ADS_MODE ? buildOwnAdsCriteria(context) : {}),
        ...(context.userState.adsViewMode === adsViewModes.SELECTED_ADS_MODE ? buildSelectedAdsCriteria(context) : {})
    };
    const result = await adsDao.findAdsByCriteria(criteria);
    context.searchResult = {
        numberOfAdsPages: result.numberOfPages,
        foundAds: result.adsSlice.reverse()
    };
}

exports.searchLocalAds = async (context) => {
    if (userInputData.ifStrContain(context.inputData, strArrForCategoryAll)) {
        throw new Error(categoryError[context.lang]);
    }
    context.userState.adsViewMode = adsViewModes.LOCAL_ADS_MODE;
    context.userState.adsCategory = context.inputData;
    context.userState.adsPage = 0;
    await searchAdsByContextState(context);
};
exports.searchOwnAds = async (context) => {
    context.userState.adsViewMode = adsViewModes.OWN_ADS_MODE;
    context.userState.adsPage = 0;
    await searchAdsByContextState(context);
};
exports.searchSelectedAds = async (context) => {
    context.userState.adsViewMode = adsViewModes.SELECTED_ADS_MODE;
    context.userState.adsPage = 0;
    await searchAdsByContextState(context);
};
exports.searchOlderAds = async (context) => {
    context.userState.adsPage += 1;
    await searchAdsByContextState(context);
};
exports.searchNewerAds = async (context) => {
    context.userState.adsPage -= 1;
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
    await addToSavedAds(context.user.id, context.inputData);
    return telmsg.editChatMessageActions(context, context.lang, getFavAdActions(false), context.inputData);
};
exports.deleteFromSaved = async (context) => {
    const ad = await deleteFromSavedAds(context.user.id, context.inputData);
    if (!ad.author && ad.usersSaved.length === 0) {
        await deleteAd(context.inputData);
    }
    return context.userState.adsViewMode === adsViewModes.SELECTED_ADS_MODE
        ? telmsg.deleteChatMessage(context)
        : telmsg.editChatMessageActions(context, context.lang, getFavAdActions(true), context.inputData);
};

exports.requestReportAd = async (context) => {
    const actions = [commands.CANCEL_REPORT, commands.CONFIRM_REPORT];
    const ad = await adsDao.findAdvertisement(context.inputData);
    return telmsg.editAdContent(context, context.lang, labels.reportAdConfirmation, actions, ad);
};
exports.cancelReportAd = async (context) => {
    const ad = await adsDao.findAdvertisement(context.inputData);
    const actions = getFavAdActions(!ad.usersSaved.includes(context.user.id));
    return telmsg.editAdContent(context, context.lang, AD_TEMPLATE(ad, context.lang), actions, ad);
};
exports.confirmReportAd = async (context) => {
    await markAsSpam(context.user.id, context.inputData);
    return telmsg.deleteChatMessage(context);
};

// ////////////////////////////////////////////////// //
//            Inline actions  MY ads                  //
// ////////////////////////////////////////////////// //

exports.requestDeleteAd = async (context) => {
    const actions = [commands.CANCEL_DELETE, commands.CONFIRM_DELETE];
    const ad = await adsDao.findAdvertisement(context.inputData);
    return telmsg.editAdContent(context, context.lang, labels.deleteAdConfirmation, actions, ad);
};
exports.cancelDeleteAd = async (context) => {
    const ad = await adsDao.findAdvertisement(context.inputData);
    return telmsg.editAdContent(context, context.lang, AD_TEMPLATE(ad, context.lang), getOwnAdActions(ad.isActive), ad);
};
exports.confirmDeleteAd = async (context) => {
    const ad = await adsDao.findAdvertisement(context.inputData);
    if (ad.usersSaved.length > 0) {
        ad.author = null;
        ad.isActive = false;
        await updateAdState(context.inputData, ad);
    } else {
        await deleteAd(context.inputData);
    }
    return telmsg.deleteChatMessage(context);
};

exports.deactivateAd = async (context) => {
    const adId = context.inputData;
    await updateAdActiveStatus(adId, false);
    return telmsg.editChatMessageActions(context, context.lang, getOwnAdActions(false), adId, labels.deactivateIsSet);
};
exports.activateAd = async (context) => {
    const adId = context.inputData;
    await updateAdActiveStatus(adId, true);
    return telmsg.editChatMessageActions(context, context.lang, getOwnAdActions(true), adId, labels.activateIsSet);
};
