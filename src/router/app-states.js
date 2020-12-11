const userHomeHandlers = require('../features/user-home/handlers');
const userSettingsHandlers = require('../features/user-settings/handlers');
const settingsAdHandlers = require('../features/ad-setting/handlers');
const displayAdHandlers = require('../features/display-ads/handlers');
const editAdHandlers = require('../features/ad-edit/handlers');

module.exports = {
    NEW_USER_START: { id: 'newUserStart' },
    USER_HOME: { id: 'userHome', renderer: userHomeHandlers.renderUserHomeView },
    // BOT_RESTART has the same id as USER_HOME. It means that two states are equal and assume the same actions.
    // They are only differed by rendered views.
    BOT_RESTART: { id: 'userHome', renderer: userHomeHandlers.renderBotRestartView },

    NEW_USER_SET_LANG: { id: 'newUserSetLang', renderer: userSettingsHandlers.renderNewUserSetLangView },
    NEW_USER_SET_LOCATION: {
        id: 'newUserSetLocation',
        renderer: userSettingsHandlers.renderNewUserSetLocationView
    },
    NEW_USER_SET_RADIUS: { id: 'newUserSetRadius', renderer: userSettingsHandlers.renderNewUserSetRadiusView },

    USER_SETTINGS: { id: 'userSettings', renderer: userSettingsHandlers.renderUserSettingsView },
    CHANGE_LOCATION: { id: 'changeLocation', renderer: userSettingsHandlers.renderChangeLocationView },
    CHANGE_RADIUS: { id: 'changeRadius', renderer: userSettingsHandlers.renderChangeRadiusView },
    VIEW_PROFILE: { id: 'viewProfile', renderer: userSettingsHandlers.renderUserProfileView },
    CHANGE_LANGUAGE: { id: 'changeLang', renderer: userSettingsHandlers.renderChangeLangView },

    START_CREATE_AD: { id: 'createAd', renderer: settingsAdHandlers.renderSetAdCategoryView },
    SET_TITLE: { id: 'setTitle', renderer: settingsAdHandlers.renderSetAdTitleView },
    SET_DESCRIPTION: { id: 'setDescription', renderer: settingsAdHandlers.renderSetAdDescriptionView },
    SET_IMAGE: { id: 'setImg', renderer: settingsAdHandlers.renderSetAdImgView },
    SET_RENUMERATION: { id: 'setRenumeration', renderer: settingsAdHandlers.renderSetAdRemunerationView },
    PREVIEW_AD: { id: 'previewAd', renderer: settingsAdHandlers.renderPreviewAdView },

    SET_ADS_CATEGORY: { id: 'setAdsCategory', renderer: displayAdHandlers.renderSelectAdsCategoryView },
    VIEW_FOUND_ADS: { id: 'viewFoundAds', renderer: displayAdHandlers.renderFoundAdsView },

    START_EDIT_AD: { id: 'editCategory', renderer: editAdHandlers.renderChangeAdCategoryView },
    EDIT_TITLE: { id: 'editTitle', renderer: editAdHandlers.renderChangeAdTitleView },
    EDIT_DESCRIPTION: { id: 'editDescription', renderer: editAdHandlers.renderChangeAdDescriptionView },
    EDIT_IMAGE: { id: 'editImage', renderer: editAdHandlers.renderChangeAdImageView },
    EDIT_REMUNERATION: { id: 'editRemuneration', renderer: editAdHandlers.renderChangeAdRemunerationView },
    FINISH_EDITING: { id: 'finishEditing', renderer: editAdHandlers.renderFinishAdEditingView }
};
