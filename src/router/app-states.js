const userHomeHandlers = require('../features/user-home/handlers');
const settingsHandlers = require('../features/user-settings/handlers');
const settingsAdHandlers = require('../features/ad-setting/handlers');
const displayHandlers = require('../features/display-ads/handlers');
const displayEditAdHandlers = require('../features/ad-edit/handlers');

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
    CHANGE_LANGUAGE: { id: 'changeLang', constructor: settingsHandlers.initChangeLangView },

    CREATE_AD: { id: 'createAd', constructor: settingsAdHandlers.userSetAdNameView },
    SET_DESCRIPTION: { id: 'setDescription', constructor: settingsAdHandlers.userSetAdDescriptionView },
    SET_CATEGORY: { id: 'setCategory', constructor: settingsAdHandlers.userSetAdCategotyView },
    SET_IMAGE: { id: 'setImg', constructor: settingsAdHandlers.userSetAdImgView },
    SET_RENUMERATION: { id: 'setRenumeration', constructor: settingsAdHandlers.userSetAdRenumerationView },
    PREVIEW_AD: { id: 'previewAd', constructor: settingsAdHandlers.userPublishAdView },

    SET_ADS_CATEGORY: { id: 'setAdsCategory', constructor: displayHandlers.initSetAdsCategoryView },
    VIEW_FOUND_ADS: { id: 'viewFoundAds', constructor: displayHandlers.initViewFoundAdsView },

    START_EDIT_THIS_AD: { id: 'editTitle', constructor: displayEditAdHandlers.initChangeTitleAdView },
    EDIT_DESCRIPTION: { id: 'editDescription', constructor: displayEditAdHandlers.initChangeDescriptionAdView },
    EDIT_CATEGORY: { id: 'editCategory', constructor: displayEditAdHandlers.initChangeCategoryAdView },
    EDIT_IMAGE: { id: 'editImage', constructor: displayEditAdHandlers.initChangeImageAdView },
    EDIT_REMUNERATION: { id: 'editRemuneration', constructor: displayEditAdHandlers.initChangeRemunerationAdView },
    FINISH_EDITING: { id: 'finishEditing', constructor: displayEditAdHandlers.initFinishEditingAdView }
};
