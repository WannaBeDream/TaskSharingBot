/* eslint-disable no-underscore-dangle */
const { Text } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const inputCms = require('../ad-categories');
const { GO_BACK: backCommand } = require('../../router/general-commands');
const { unknownCommand: unknownCommandLabel } = require('../../router/labels');
const { AD_TEMPLATE } = require('../ad-template');

const adsDao = require('../../database/find');
const { addToSavedAds, deleteFromSavedAds } = require('../../database/update');
const { deleteAd } = require('../../database/delete');

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

exports.initViewFoundAdsView = (context) => {
    const { adsViewMode } = context.userState;
    const adsList = context.searchResult.foundAds.map((ad) => {
        const adView = new Text(AD_TEMPLATE(ad, context.lang));
        const inlineButtons = [];
        if (adsViewMode === adsViewModes.OWN_ADS_MODE) {
            const activateCmd = ad.isActive ? commands.DEACTIVATE_AD : commands.ACTIVATE_AD;
            inlineButtons.push(buildInlineButton(ad._id, activateCmd, context.lang));
            inlineButtons.push(buildInlineButton(ad._id, commands.EDIT_AD, context.lang));
        } else {
            const favCmd = adsViewMode === adsViewModes.LOCAL_ADS_MODE ? commands.ADD_TO_FAV : commands.REMOVE_FROM_FAV;
            inlineButtons.push(buildInlineButton(ad._id, favCmd, context.lang));
            inlineButtons.push(buildInlineButton(ad._id, commands.REPORT, context.lang));
        }
        return adView.addInlineKeyboard([inlineButtons]).get();
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
    return [
        new Text('--').addReplyKeyboard([[backCommand.title[context.lang]]], true).get(),
        ...adsList,
        new Text('--').addReplyKeyboard(navFull, true).get()
    ];
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

function deleteMessageFromChat(context) {
    return {
        method: 'deleteMessage',
        body: { chat_id: context.chat_id, message_id: context.message_id }
    };
}

exports.addToSaved = async (context) => {
    await addToSavedAds(context.user.id, context.inputData);
};
exports.deleteFromSaved = async (context) => {
    await deleteFromSavedAds(context.user.id, context.inputData);
    return deleteMessageFromChat(context);
};

exports.deleteMyAd = async (context) => {
    await deleteAd(context.inputData);
    return deleteMessageFromChat(context);
};

exports.reportSpam = (context) => {
    return deleteMessageFromChat(context);
};
