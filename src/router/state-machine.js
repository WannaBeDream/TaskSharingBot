const appStates = require('./app-states');
const generalCommands = require('../features/general-commands');

const userHomeCommands = require('../features/user-home/commands');
const userHomeHandlers = require('../features/user-home/handlers');
const settingsCommands = require('../features/user-settings/commands');
const settingsHandlers = require('../features/user-settings/handlers');

const settingAdCommands = require('../features/ad-setting/commands');
const settingAdHandlers = require('../features/ad-setting/handlers');
const viewAdsCommands = require('../features/display-ads/commands');
const viewAdsHandlers = require('../features/display-ads/handlers');
const editAdCommands = require('../features/ad-edit/commands');
const editAdHandlers = require('../features/ad-edit/handlers');

const globalTransitions = {
    [userHomeCommands.USER_SETTINGS.id]: { targetState: appStates.USER_SETTINGS },
    [settingsCommands.CHANGE_LANG.id]: { targetState: appStates.CHANGE_LANGUAGE },
    [settingsCommands.VIEW_PROFILE.id]: { targetState: appStates.VIEW_PROFILE },
    [settingsCommands.CHANGE_LOCATION.id]: { targetState: appStates.CHANGE_LOCATION },
    [settingsCommands.CHANGE_RADIUS.id]: { targetState: appStates.CHANGE_RADIUS },
    [userHomeCommands.CREATE_AD.id]: { targetState: appStates.START_CREATE_AD },
    [userHomeCommands.LOCAL_ADS.id]: {
        handler: viewAdsHandlers.startLocalAdsSearch,
        targetState: appStates.SET_ADS_CATEGORY
    },
    [userHomeCommands.OWN_ADS.id]: {
        handler: viewAdsHandlers.searchOwnAds,
        targetState: appStates.VIEW_FOUND_ADS
    },
    [userHomeCommands.SELECTED_ADS.id]: {
        handler: viewAdsHandlers.searchSelectedAds,
        targetState: appStates.VIEW_FOUND_ADS
    },
    [generalCommands.GO_BACK.id]: { targetState: appStates.USER_HOME },
    [generalCommands.START_BOT.id]: { targetState: appStates.BOT_RESTART }
};
const settingsTransitions = {
    ...globalTransitions,
    [generalCommands.GO_BACK.id]: { targetState: appStates.USER_SETTINGS }
};
const settingAdBotRestart = {
    [generalCommands.START_BOT.id]: {
        handler: settingAdHandlers.cancelSettingAd,
        targetState: appStates.BOT_RESTART
    }
};
const editAdBotRestart = {
    [generalCommands.START_BOT.id]: {
        handler: editAdHandlers.finishEditing,
        targetState: appStates.BOT_RESTART
    }
};

const adsInlineCommands = {
    [viewAdsCommands.REPORT_REQUEST.id]: { handler: viewAdsHandlers.requestReportAd },
    [viewAdsCommands.CANCEL_REPORT.id]: { handler: viewAdsHandlers.cancelReportAd },
    [viewAdsCommands.CONFIRM_REPORT.id]: { handler: viewAdsHandlers.confirmReportAd },

    [viewAdsCommands.DELETE_REQUEST.id]: { handler: viewAdsHandlers.requestDeleteAd },
    [viewAdsCommands.CANCEL_DELETE.id]: { handler: viewAdsHandlers.cancelDeleteAd },
    [viewAdsCommands.CONFIRM_DELETE.id]: { handler: viewAdsHandlers.confirmDeleteAd },
    [viewAdsCommands.INSTANT_DELETE.id]: { handler: viewAdsHandlers.confirmDeleteAd },

    [viewAdsCommands.ADD_TO_FAV.id]: { handler: viewAdsHandlers.addToSaved },
    [viewAdsCommands.REMOVE_FROM_FAV.id]: { handler: viewAdsHandlers.deleteFromSaved },
    [viewAdsCommands.DEACTIVATE_AD.id]: { handler: viewAdsHandlers.deactivateAd },
    [viewAdsCommands.ACTIVATE_AD.id]: { handler: viewAdsHandlers.activateAd }
};

module.exports = {
    // New user registration
    [appStates.NEW_USER_START.id]: {
        [generalCommands.START_BOT.id]: {
            handler: userHomeHandlers.renderUserGreetingView,
            targetState: appStates.NEW_USER_SET_LANG
        }
    },
    [appStates.NEW_USER_SET_LANG.id]: {
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setLanguage,
            targetState: appStates.NEW_USER_SET_LOCATION
        }
    },
    [appStates.NEW_USER_SET_LOCATION.id]: {
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setLocation,
            targetState: appStates.NEW_USER_SET_RADIUS
        }
    },
    [appStates.NEW_USER_SET_RADIUS.id]: {
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setRadius,
            targetState: appStates.USER_HOME
        }
    },
    // misc
    [appStates.USER_HOME.id]: globalTransitions,
    [appStates.USER_SETTINGS.id]: globalTransitions,
    [appStates.VIEW_PROFILE.id]: settingsTransitions,
    // User change own data
    [appStates.CHANGE_LOCATION.id]: {
        ...settingsTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setLocation,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.CHANGE_RADIUS.id]: {
        ...settingsTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setRadius,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.CHANGE_LANGUAGE.id]: {
        ...settingsTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setLanguage,
            targetState: appStates.USER_HOME
        }
    },
    // User create new ad
    [appStates.START_CREATE_AD.id]: {
        ...settingAdBotRestart,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingAdHandlers.setCategory,
            targetState: appStates.SET_TITLE
        },
        [generalCommands.GO_BACK.id]: {
            handler: settingAdHandlers.cancelSettingAd,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.SET_TITLE.id]: {
        ...settingAdBotRestart,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingAdHandlers.setTitle,
            targetState: appStates.SET_DESCRIPTION
        }
    },
    [appStates.SET_DESCRIPTION.id]: {
        ...settingAdBotRestart,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingAdHandlers.setDescription,
            targetState: appStates.SET_IMAGE
        }
    },
    [appStates.SET_IMAGE.id]: {
        ...settingAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.SET_RENUMERATION
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: settingAdHandlers.setImg,
            targetState: appStates.SET_RENUMERATION
        }
    },
    [appStates.SET_RENUMERATION.id]: {
        ...settingAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.PREVIEW_AD
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: settingAdHandlers.setRenumeration,
            targetState: appStates.PREVIEW_AD
        }
    },
    [appStates.PREVIEW_AD.id]: {
        ...settingAdBotRestart,
        [settingAdCommands.PUBLISH_AD.id]: {
            handler: settingAdHandlers.publish,
            targetState: appStates.USER_HOME
        },
        [settingAdCommands.CANCEL_AD.id]: {
            handler: settingAdHandlers.cancelSettingAd,
            targetState: appStates.USER_HOME
        }
    },
    // Search & View Ads
    [appStates.SET_ADS_CATEGORY.id]: {
        ...globalTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: viewAdsHandlers.searchLocalAds,
            targetState: appStates.VIEW_FOUND_ADS
        }
    },
    [appStates.VIEW_FOUND_ADS.id]: {
        ...globalTransitions,
        [viewAdsCommands.OLDER_ADS.id]: {
            handler: viewAdsHandlers.searchOlderAds,
            targetState: appStates.VIEW_FOUND_ADS
        },
        [viewAdsCommands.NEWER_ADS.id]: {
            handler: viewAdsHandlers.searchNewerAds,
            targetState: appStates.VIEW_FOUND_ADS
        },
        [viewAdsCommands.EDIT_AD.id]: {
            handler: editAdHandlers.startEditAd,
            targetState: appStates.START_EDIT_AD
        },
        ...adsInlineCommands
    },
    [appStates.START_EDIT_AD.id]: {
        ...editAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_TITLE
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editAdHandlers.updateCategory,
            targetState: appStates.EDIT_TITLE
        }
    },
    [appStates.EDIT_TITLE.id]: {
        ...editAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_DESCRIPTION
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editAdHandlers.updateTitle,
            targetState: appStates.EDIT_DESCRIPTION
        }
    },
    [appStates.EDIT_DESCRIPTION.id]: {
        ...editAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_IMAGE
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editAdHandlers.updateDescription,
            targetState: appStates.EDIT_IMAGE
        }
    },
    [appStates.EDIT_IMAGE.id]: {
        ...editAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_REMUNERATION
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editAdHandlers.updateImage,
            targetState: appStates.EDIT_REMUNERATION
        }
    },
    [appStates.EDIT_REMUNERATION.id]: {
        ...editAdBotRestart,
        [generalCommands.SKIP.id]: {
            targetState: appStates.FINISH_EDITING
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editAdHandlers.updateRemuneration,
            targetState: appStates.FINISH_EDITING
        }
    },
    [appStates.FINISH_EDITING.id]: {
        ...editAdBotRestart,
        [editAdCommands.FINISH_EDITING.id]: {
            handler: editAdHandlers.finishEditing,
            targetState: appStates.USER_HOME
        }
    }
};
