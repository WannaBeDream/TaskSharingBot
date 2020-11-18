const userHomeHandlers = require('../features/user-home/handlers');
const settingsHandlers = require('../features/user-settings/handlers');

module.exports = {
    NEW_USER_START: { id: 'newUserStart' },
    USER_HOME: { id: 'userHome', constructor: userHomeHandlers.initUserHomeView },

    NEW_USER_SET_LANG: { id: 'newUserSetLang', constructor: settingsHandlers.initNewUserChangeLangView },
    NEW_USER_SET_LOCATION: {
        id: 'newUserSetLocation',
        constructor: settingsHandlers.initNewUserSetLocationView
    },
    NEW_USER_SET_RADIUS: { id: 'newUserSetRadius', constructor: settingsHandlers.initNewUserSetRadiusView },

    USER_SETTINGS: { id: 'userSettings', constructor: settingsHandlers.initUserSettingsView },
    CHANGE_LOCATION: { id: 'changeLocation', constructor: settingsHandlers.initChangeLocationView },
    CHANGE_RADIUS: { id: 'changeRadius', constructor: settingsHandlers.initChangeRadiusView },
    VIEW_PROFILE: { id: 'viewProfile', constructor: settingsHandlers.initViewProfileView },
    CHANGE_LANGUAGE: { id: 'changeLang', constructor: settingsHandlers.initChangeLangView }
};
