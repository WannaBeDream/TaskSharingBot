const appStates = require('./app-states');
const userHomeCommands = require('../features/user-home/commands');
const userHomeHandlers = require('../features/user-home/handlers');
const settingsCommands = require('../features/user-settings/commands');
const settingsHandlers = require('../features/user-settings/handlers');
const generalCommands = require('../features/general-commands');

const settingsAdCommands = require('../features/ad-setting/commands');
const settingsAdHandlers = require('../features/ad-setting/handlers');
const viewAdsCommands = require('../features/display-ads/commands');
const viewAdsHandlers = require('../features/display-ads/handlers');

const editSettingsAdHandlers = require('../features/ad-edit/handlers');

const globalTransitions = {
    [userHomeCommands.USER_SETTINGS.id]: { targetState: appStates.USER_SETTINGS },
    [settingsCommands.CHANGE_LANG.id]: { targetState: appStates.CHANGE_LANGUAGE },
    [settingsCommands.VIEW_PROFILE.id]: { targetState: appStates.VIEW_PROFILE },
    [settingsCommands.CHANGE_LOCATION.id]: { targetState: appStates.CHANGE_LOCATION },
    [settingsCommands.CHANGE_RADIUS.id]: { targetState: appStates.CHANGE_RADIUS },
    [generalCommands.START_BOT.id]: {
        handler: userHomeHandlers.getUserGreeting,
        targetState: appStates.USER_HOME
    },
    [userHomeCommands.CREATE_AD.id]: { targetState: appStates.CREATE_AD },
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
    [generalCommands.GO_BACK.id]: { targetState: appStates.USER_HOME }
};
const settingsTransitions = {
    ...globalTransitions,
    [generalCommands.GO_BACK.id]: { targetState: appStates.USER_SETTINGS }
};

const adsInlineCommands = {
    [viewAdsCommands.REPORT.id]: { handler: viewAdsHandlers.reportSpam },
    [viewAdsCommands.CANCEL_REPORT.id]: { handler: viewAdsHandlers.unreportAd },
    [viewAdsCommands.ADD_TO_FAV.id]: { handler: viewAdsHandlers.addToSaved },
    [viewAdsCommands.REMOVE_FROM_FAV.id]: { handler: viewAdsHandlers.deleteFromSaved },
    [viewAdsCommands.DEACTIVATE_AD.id]: { handler: viewAdsHandlers.deactivateAd },
    [viewAdsCommands.ACTIVATE_AD.id]: { handler: viewAdsHandlers.activateAd },
    [viewAdsCommands.DELETE_REQUEST.id]: { handler: viewAdsHandlers.requestDeleteAd },
    [viewAdsCommands.CONFIRM_DELETE.id]: { handler: viewAdsHandlers.confirmDeleteAd },
    [viewAdsCommands.CANCEL_DELETE.id]: { handler: viewAdsHandlers.cancelDeleteAd }
};

module.exports = {
    [appStates.NEW_USER_START.id]: {
        [generalCommands.START_BOT.id]: {
            handler: userHomeHandlers.getNewUserGreeting,
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
    [appStates.USER_HOME.id]: globalTransitions,
    [appStates.USER_SETTINGS.id]: globalTransitions,
    [appStates.CHANGE_LOCATION.id]: {
        ...settingsTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setLocation,
            targetState: appStates.USER_SETTINGS
        }
    },
    [appStates.CHANGE_RADIUS.id]: {
        ...settingsTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setRadius,
            targetState: appStates.USER_SETTINGS
        }
    },
    [appStates.VIEW_PROFILE.id]: settingsTransitions,
    [appStates.CHANGE_LANGUAGE.id]: {
        ...settingsTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsHandlers.setLanguage,
            targetState: appStates.USER_SETTINGS
        }
    },

    [appStates.CREATE_AD.id]: {
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setCategory,
            targetState: appStates.SET_TITLE
        },
        [settingsAdCommands.CANCEL_AD.id]: {
            handler: settingsAdHandlers.cancel,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.SET_TITLE.id]: {
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setTitle,
            targetState: appStates.SET_DESCRIPTION
        },
        [settingsAdCommands.CANCEL_AD.id]: {
            handler: settingsAdHandlers.cancel,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.SET_DESCRIPTION.id]: {
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setDescription,
            targetState: appStates.SET_IMAGE
        },
        [settingsAdCommands.CANCEL_AD.id]: {
            handler: settingsAdHandlers.cancel,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.SET_IMAGE.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.SET_RENUMERATION
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setImg,
            targetState: appStates.SET_RENUMERATION
        },
        [settingsAdCommands.CANCEL_AD.id]: {
            handler: settingsAdHandlers.cancel,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.SET_RENUMERATION.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.PREVIEW_AD
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setRenumeration,
            targetState: appStates.PREVIEW_AD
        },
        [settingsAdCommands.CANCEL_AD.id]: {
            handler: settingsAdHandlers.cancel,
            targetState: appStates.USER_HOME
        }
    },
    [appStates.PREVIEW_AD.id]: {
        [settingsAdCommands.PUBLISH_AD.id]: {
            handler: settingsAdHandlers.publish,
            targetState: appStates.USER_HOME
        },
        [settingsAdCommands.CANCEL_AD.id]: {
            handler: settingsAdHandlers.cancel,
            targetState: appStates.USER_HOME
        }
    },

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
        [viewAdsCommands.CHANGE_CATEGORY.id]: {
            handler: viewAdsHandlers.checkChangeCategoryAuthorization,
            targetState: appStates.SET_ADS_CATEGORY
        },
        [viewAdsCommands.EDIT_AD.id]: {
            handler: viewAdsHandlers.startEditAd,
            targetState: appStates.EDIT_CATEGORY
        },
        ...adsInlineCommands
    },
    [appStates.EDIT_CATEGORY.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_TITLE
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editSettingsAdHandlers.updateCategory,
            targetState: appStates.EDIT_TITLE
        }
    },
    [appStates.EDIT_TITLE.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_DESCRIPTION
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editSettingsAdHandlers.updateTitle,
            targetState: appStates.EDIT_DESCRIPTION
        }
    },
    [appStates.EDIT_DESCRIPTION.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_IMAGE
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editSettingsAdHandlers.updateDescription,
            targetState: appStates.EDIT_IMAGE
        }
    },
    [appStates.EDIT_IMAGE.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.EDIT_REMUNERATION
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editSettingsAdHandlers.updateImage,
            targetState: appStates.EDIT_REMUNERATION
        }
    },
    [appStates.EDIT_REMUNERATION.id]: {
        [generalCommands.SKIP.id]: {
            targetState: appStates.FINISH_EDITING
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: editSettingsAdHandlers.updateRemuneration,
            targetState: appStates.FINISH_EDITING
        }
    },
    [appStates.FINISH_EDITING.id]: {
        [generalCommands.DATA_INPUT.id]: {
            targetState: appStates.USER_HOME
        }
    }
};
