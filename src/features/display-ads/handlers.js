/* eslint-disable no-underscore-dangle */
const { Text, Photo } = require('claudia-bot-builder').telegramTemplate;
const _ = require('lodash');
const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const { GO_BACK: backCommand } = require('../general-commands');
const { unknownCommand: unknownCommandLabel } = require('../unknown-labels');
const { AD_TEMPLATE } = require('../ad-template');
const { SPAM_COUNTER } = require('../../constants/db-values');

const adsDao = require('../../database/methods/find');
const {
    addToSavedAds,
    deleteFromSavedAds,
    markAsSpam,
    updateAdActiveStatus,
    updateAdState
} = require('../../database/methods/update');
const { deleteAd } = require('../../database/methods/delete');

const adsViewModes = {
    LOCAL_ADS_MODE: 'localAdsMode',
    SELECTED_ADS_MODE: 'selectedAdsMode',
    OWN_ADS_MODE: 'ownAdsMode'
};

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.initSetAdsCategoryView = (context) => {
    return new Text(labels.selectAdsCategory[context.lang])
        .addReplyKeyboard(
            [
                [inputCms.ASSISTANCE_SEARCH.title[context.lang], inputCms.BUY_STUFF.title[context.lang]],
                [inputCms.SERVICES_OFFER.title[context.lang], inputCms.SALES.title[context.lang]],
                [backCommand.title[context.lang], inputCms.LOST_FOUND_ADS.title[context.lang]]
            ],
            true
        )
        .get();
};

function buildInlineButton(key, command, lang) {
    return {
        text: command.title[`${lang}`],
        callback_data: JSON.stringify({ key, cmd: command.id })
    };
}

// eslint-disable-next-line
exports.initViewFoundAdsView = (context) => {
    const { adsViewMode } = context.userState;
    const adsList = context.searchResult.foundAds.map((ad) => {
        const adView = new Text(AD_TEMPLATE(ad, context.lang));
        const inlineButtons = [];
        if (adsViewMode === adsViewModes.OWN_ADS_MODE) {
            if (ad.spam.length >= SPAM_COUNTER) {
                inlineButtons.push(buildInlineButton(ad._id, commands.DELETE_REQUEST, context.lang));
            } else {
                const activateCmd = ad.isActive ? commands.DEACTIVATE_AD : commands.ACTIVATE_AD;
                inlineButtons.push(buildInlineButton(ad._id, activateCmd, context.lang));
                inlineButtons.push(buildInlineButton(ad._id, commands.EDIT_AD, context.lang));
                inlineButtons.push(buildInlineButton(ad._id, commands.DELETE_REQUEST, context.lang));
            }
        } else if (adsViewMode === adsViewModes.LOCAL_ADS_MODE) {
            const favCmd = ad.usersSaved.includes(context.chat_id) ? commands.REMOVE_FROM_FAV : commands.ADD_TO_FAV;
            inlineButtons.push(buildInlineButton(ad._id, favCmd, context.lang));
            inlineButtons.push(buildInlineButton(ad._id, commands.REPORT, context.lang));
        } else {
            inlineButtons.push(buildInlineButton(ad._id, commands.REMOVE_FROM_FAV, context.lang));
        }
        if (!ad.imgId) {
            return adView.addInlineKeyboard([inlineButtons]).get();
        }
        return [new Photo(ad.imgId, ad.title).get(), adView.addInlineKeyboard([inlineButtons]).get()];
    });
    const navLine1 = [
        ...(context.userState.adsPage > 0 ? [commands.NEWER_ADS.title[context.lang]] : []),
        ...(context.userState.adsPage < context.searchResult.numberOfAdsPages - 1
            ? [commands.OLDER_ADS.title[context.lang]]
            : [])
    ];
    const navLine2 = [
        backCommand.title[context.lang],
        ...(adsViewMode === adsViewModes.LOCAL_ADS_MODE ? [commands.CHANGE_CATEGORY.title[context.lang]] : [])
    ];
    const navFull = navLine1 ? [navLine1, navLine2] : [navLine2];
    return _.flatten([
        new Text('--').addReplyKeyboard([[backCommand.title[context.lang]]], true).get(),
        ...adsList,
        new Text('--').addReplyKeyboard(navFull, true).get()
    ]);
};

// ////////////////////////////////////////////////// //
//                  Search logic                      //
// ////////////////////////////////////////////////// //

exports.startLocalAdsSearch = (context) => {
    // eslint-disable-next-line no-param-reassign
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
        foundAds: result.adsSlice
    };
}

exports.searchLocalAds = async (context) => {
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

function answerCallbackQuery(queryId, alert) {
    return {
        method: 'answerCallbackQuery',
        body: {
            callback_query_id: queryId,
            ...(alert ? { text: alert, show_alert: true } : {})
        }
    };
}

function editChatMessage(context, newText, actions, adId) {
    const inlineButtons = actions.map((cmd) => buildInlineButton(adId, cmd, context.lang));
    return {
        method: 'editMessageText',
        body: {
            chat_id: context.chat_id,
            message_id: context.message_id,
            text: newText,
            parse_mode: 'Markdown',
            reply_markup: { inline_keyboard: [inlineButtons] }
        }
    };
}

function editChatMessageActions(context, actions, adId) {
    const inlineButtons = actions.map((cmd) => buildInlineButton(adId, cmd, context.lang));
    return {
        method: 'editMessageReplyMarkup',
        body: {
            chat_id: context.chat_id,
            message_id: context.message_id,
            reply_markup: { inline_keyboard: [inlineButtons] }
        }
    };
}

// ////////////////////////////////////////////////// //
//                  Delete logic                      //
// ////////////////////////////////////////////////// //

function deleteMessageFromChat(context, imgId) {
    if (!imgId) {
        return [
            {
                method: 'deleteMessage',
                body: { chat_id: context.chat_id, message_id: context.message_id }
            }
        ];
    }
    return [
        {
            method: 'deleteMessage',
            body: { chat_id: context.chat_id, message_id: context.message_id }
        },
        {
            method: 'deleteMessage',
            body: { chat_id: context.chat_id, message_id: context.message_id - 1 }
        }
    ];
}

// ////////////////////////////////////////////////// //
//           Inline buttons generators                //
// ////////////////////////////////////////////////// //

function getMyAdActions(isAdActive) {
    return [isAdActive ? commands.DEACTIVATE_AD : commands.ACTIVATE_AD, commands.EDIT_AD, commands.DELETE_REQUEST];
}

function getMySavedAdActions(isAdFav) {
    return [isAdFav ? commands.ADD_TO_FAV : commands.REMOVE_FROM_FAV, commands.REPORT];
}

// ////////////////////////////////////////////////// //
//            Inline actions  ALL ads                 //
// ////////////////////////////////////////////////// //

exports.addToSaved = async (context) => {
    await addToSavedAds(context.user.id, context.inputData);
    return editChatMessageActions(context, getMySavedAdActions(false), context.inputData);
};

exports.deleteFromSaved = async (context) => {
    const ad = await deleteFromSavedAds(context.user.id, context.inputData);
    if ((!ad.author || ad.spam.length >= SPAM_COUNTER) && ad.usersSaved.length === 0) {
        await deleteAd(context.inputData);
    }
    return context.userState.adsViewMode === adsViewModes.SELECTED_ADS_MODE
        ? deleteMessageFromChat(context, ad.imgId)
        : editChatMessageActions(context, getMySavedAdActions(true), context.inputData);
};

exports.reportSpam = async (context) => {
    const imgId = await markAsSpam(context.user.id, context.inputData);
    return deleteMessageFromChat(context, imgId);
};

// ////////////////////////////////////////////////// //
//            Inline actions  MY ads                  //
// ////////////////////////////////////////////////// //

exports.startEditAd = (context) => {
    context.userState.currentUpdateAd = context.inputData;
    return answerCallbackQuery(context.callback_query_id, labels.editAdIsStarted[context.lang]);
};

exports.requestDeleteAd = (context) => {
    const actions = [commands.CANCEL_DELETE, commands.CONFIRM_DELETE];
    return [
        answerCallbackQuery(context.callback_query_id),
        editChatMessage(context, labels.deleteAdConfirmation[context.lang], actions, context.inputData)
    ];
};
exports.cancelDeleteAd = async (context) => {
    const ad = await adsDao.findAdvertisement(context.inputData);
    return [
        answerCallbackQuery(context.callback_query_id),
        editChatMessage(context, AD_TEMPLATE(ad, context.lang), getMyAdActions(ad.isActive), ad._id)
    ];
};

exports.confirmDeleteAd = async (context) => {
    const ad = await adsDao.findAdvertisement(context.inputData);
    if (ad.usersSaved.length > 0) {
        ad.author = null;
        ad.isActive = false;
        await updateAdState(context.inputData, ad);
        return [answerCallbackQuery(context.callback_query_id), ...deleteMessageFromChat(context, ad.imgId)];
    }
    await deleteAd(context.inputData);
    return [answerCallbackQuery(context.callback_query_id), ...deleteMessageFromChat(context, ad.imgId)];
};

exports.deactivateAd = async (context) => {
    await updateAdActiveStatus(context.inputData, false);
    return [
        answerCallbackQuery(context.callback_query_id, labels.deactivateIsSet[context.lang]),
        editChatMessageActions(context, getMyAdActions(false), context.inputData)
    ];
};
exports.activateAd = async (context) => {
    await updateAdActiveStatus(context.inputData, true);
    return [
        answerCallbackQuery(context.callback_query_id, labels.activateIsSet[context.lang]),
        editChatMessageActions(context, getMyAdActions(true), context.inputData)
    ];
};
