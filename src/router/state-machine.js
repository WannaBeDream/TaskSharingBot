const appStates = require('./app-states');
const userHomeCommands = require('../features/user-home/commands');
const userAdCommands = require('../features/ad-setting/commands');
const userHomeHandlers = require('../features/user-home/handlers');
const settingsCommands = require('../features/user-settings/commands');
const settingsHandlers = require('../features/user-settings/handlers');
const generalCommands = require('./general-commands');
const settingsAdHandlers = require('../features/ad-setting/handlers');

const globalTransitions = {
    [userHomeCommands.CREATE_AD.id]: { targetState: appStates.CREATE_AD },
    [userHomeCommands.ALL_ADS.id]: { targetState: appStates.ALL_ADS },
    [userHomeCommands.MY_ADS.id]: { targetState: appStates.MY_ADS },
    [userHomeCommands.USER_SAVED_ADS.id]: { targetState: appStates.USER_SAVED_ADS },
    [userAdCommands.PUBLISH_AD.id]: { targetState: appStates.PUBLISH_AD },
    [userAdCommands.CANCEL_AD.id]: { targetState: appStates.CANCEL_AD },

    [userHomeCommands.USER_SETTINGS.id]: { targetState: appStates.USER_SETTINGS },
    [settingsCommands.CHANGE_LANG.id]: { targetState: appStates.CHANGE_LANGUAGE },
    [settingsCommands.VIEW_PROFILE.id]: { targetState: appStates.VIEW_PROFILE },
    [settingsCommands.CHANGE_LOCATION.id]: { targetState: appStates.CHANGE_LOCATION },
    [settingsCommands.CHANGE_RADIUS.id]: { targetState: appStates.CHANGE_RADIUS },
    [generalCommands.START_BOT.id]: {
        handler: userHomeHandlers.getUserGreeting,
        targetState: appStates.USER_HOME
    }
};
const settingsTransitions = {
    ...globalTransitions,
    [generalCommands.GO_BACK.id]: { targetState: appStates.USER_SETTINGS }
};

const settingsAdTransitions = {
    [generalCommands.GO_BACK.id]: { targetState: appStates.USER_SETTINGS }
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
    [appStates.USER_SETTINGS.id]: {
        ...globalTransitions,
        [generalCommands.GO_BACK.id]: { targetState: appStates.USER_HOME }
    },
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
        ...settingsAdTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setTitle,
            targetState: appStates.SET_DESCRIPTION
        }
    },

    [appStates.SET_DESCRIPTION.id]: {
        ...settingsAdTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setDescription,
            targetState: appStates.SET_CATEGORY
        }
    },

    [appStates.SET_CATEGORY.id]: {
        ...settingsAdTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setCategory,
            targetState: appStates.SET_RENUMERATION
        }
    },

    [appStates.SET_RENUMERATION.id]: {
        ...settingsAdTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setRenumeration,
            targetState: appStates.SET_LOCATION
        }
    },

    [appStates.SET_LOCATION.id]: {
        ...settingsAdTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.setLocation,
            targetState: appStates.PREVIEW_AD
        }
    },

    [appStates.PREVIEW_AD.id]: {
        ...settingsAdTransitions,
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.publish,
            targetState: appStates.PUBLISH_AD
        },
        [generalCommands.DATA_INPUT.id]: {
            handler: settingsAdHandlers.publish,
            targetState: appStates.PUBLISH_AD
        }
    },

    [appStates.PUBLISH_AD.id]: {
        ...globalTransitions,
        [generalCommands.GO_BACK.id]: { targetState: appStates.USER_HOME }
    },

    [appStates.ALL_ADS.id]: {
        ...globalTransitions
    },

    [appStates.MY_ADS.id]: {
        ...globalTransitions
    },

    [appStates.USER_SAVED_ADS.id]: {
        ...globalTransitions
    }
};
