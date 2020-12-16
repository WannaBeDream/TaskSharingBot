const { Text, Location } = require('claudia-bot-builder').telegramTemplate;

const labels = require('./labels');
const commands = require('./commands');
const { GO_BACK: backCommand } = require('../general-commands');
const { updateUserLang, updateUserLocation, updateUserSearchRadius } = require('../../database/methods/update');
const CustomException = require('../../helpers/exeptions');

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.renderNewUserSetLocationView = (context) => {
    const setLocationButton = [{ text: labels.locationAutoSend[context.lang], request_location: true }];
    return new Text(labels.newUserEnterLocation[context.lang]).addReplyKeyboard([setLocationButton], true).get();
};

exports.renderNewUserSetRadiusView = (context) => {
    return new Text(labels.newUserEnterRadius[context.lang])
        .addReplyKeyboard(
            [
                labels.existingUserSetRadius[context.lang](['1', '3', '5']),
                labels.existingUserSetRadius[context.lang](['10', '20', '50'])
            ],
            true
        )
        .get();
};

exports.renderUserSettingsView = (context) => {
    return new Text(labels.choose[context.lang])
        .addReplyKeyboard(
            [
                [commands.CHANGE_LOCATION.title[context.lang], commands.CHANGE_RADIUS.title[context.lang]],
                [commands.VIEW_PROFILE.title[context.lang]],
                [backCommand.title[context.lang], commands.CHANGE_LANG.title[context.lang]]
            ],
            true
        )
        .get();
};

exports.renderChangeLocationView = (context) => {
    const getBackButton = [backCommand.title[context.lang]];
    const setLocationButton = [{ text: labels.locationAutoSend[context.lang], request_location: true }];
    return [
        new Text(labels.existingUserChangeLocation[context.lang]).get(),
        new Location(context.user.location.coordinates[1], context.user.location.coordinates[0])
            .addReplyKeyboard([setLocationButton, getBackButton], true)
            .get()
    ];
};

exports.renderChangeRadiusView = (context) => {
    return new Text(labels.existingUserChangeRadius[context.lang](context.user.searchRadius))
        .addReplyKeyboard(
            [
                labels.existingUserSetRadius[context.lang](['1', '3', '5']),
                labels.existingUserSetRadius[context.lang](['10', '20', '50']),
                [backCommand.title[context.lang]]
            ],
            true
        )
        .get();
};

exports.renderUserProfileView = (context) => {
    return [
        new Text(labels.userProfileData[context.lang](context.user.searchRadius)).get(),
        new Location(context.user.location.coordinates[1], context.user.location.coordinates[0])
            .addReplyKeyboard([[backCommand.title[context.lang]]], true)
            .get()
    ];
};

exports.renderChangeLangView = (context) => {
    return new Text(labels.setLanguage[context.lang])
        .addReplyKeyboard([[labels.language.en, labels.language.ua], [backCommand.title[context.lang]]], true)
        .get();
};

exports.renderNewUserSetLangView = () => {
    return new Text(labels.newUserSetLanguage.ua)
        .addReplyKeyboard([[labels.language.en, labels.language.ua]], true)
        .get();
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setLanguage = (context) => {
    if (context.inputData === labels.language.en || context.inputData === 'en') {
        context.lang = 'en';
    } else if (context.inputData === labels.language.ua || context.inputData === 'ua') {
        context.lang = 'ua';
    } else {
        throw new CustomException('not supported language');
    }
    return updateUserLang(context.user.id, context.lang);
};

exports.setRadius = (context) => {
    if (typeof context.inputData !== 'string' || context.inputData === '') {
        throw new CustomException(labels.incorrectRadius[context.lang]);
    }
    const radius =
        context.inputData.endsWith('km') || context.inputData.endsWith('км')
            ? +context.inputData.substr(0, context.inputData.length - 2).trim()
            : +context.inputData;

    if (!Number.isInteger(radius) || radius < 1 || radius > 50) {
        throw new CustomException(labels.incorrectRadius[context.lang]);
    }
    return updateUserSearchRadius(context.user.id, radius);
};

exports.setLocation = async (context) => {
    if (!context.inputData || !context.inputData.latitude || !context.inputData.longitude) {
        throw new CustomException(labels.locationNotSet[context.lang]);
    }

    const newLocation = {
        type: 'Point',
        coordinates: [context.inputData.longitude, context.inputData.latitude]
    };
    return updateUserLocation(context.user.id, newLocation);
};
