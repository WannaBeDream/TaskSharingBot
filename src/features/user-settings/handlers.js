const { Text, Location } = require('claudia-bot-builder').telegramTemplate;

const labels = require('./labels');
const commands = require('./commands');
const { GO_BACK: backCommand } = require('../general-commands');
const { unknownCommand: unknownCommandLabel } = require('../unknown-labels');
const { fetchUserAndUpdateAdvLoc } = require('../../database/methods/update');

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.initNewUserSetLocationView = (context) => {
    const message = labels.newUserEnterLocation[context.lang];
    const setLocationButton = [{ text: labels.locationAutoSend[context.lang], request_location: true }];

    return new Text(message).addReplyKeyboard([setLocationButton], true).get();
};

exports.initNewUserSetRadiusView = (context) => {
    return new Text(labels.newUserEnterRadius[context.lang])
        .addReplyKeyboard(
            [
                labels.existingUserSetRadius[context.lang](['1', '3', '5']),
                labels.existingUserSetRadius[context.lang](['10', '20', '50']),
                []
            ],
            true
        )
        .get();
};

exports.initUserSettingsView = (context) => {
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

exports.initChangeLocationView = (context) => {
    const getBackButton = [backCommand.title[context.lang]];
    const setLocationButton = [{ text: labels.locationAutoSend[context.lang], request_location: true }];

    return [
        new Text(labels.existingUserChangeLocation[context.lang]).get(),
        new Location(context.userState.location.coordinates[1], context.userState.location.coordinates[0])
            .addReplyKeyboard([setLocationButton, getBackButton], true)
            .get()
    ];
};

exports.initChangeRadiusView = (context) => {
    return new Text(labels.existingUserChangeRadius[context.lang](context.userState.searchRadius))
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

exports.initViewProfileView = (context) => {
    return [
        new Text(labels.userProfileData[context.lang](context.userState.searchRadius)).get(),
        new Location(context.userState.location.coordinates[1], context.userState.location.coordinates[0])
            .addReplyKeyboard([[backCommand.title[context.lang]]], true)
            .get()
    ];
};

exports.initChangeLangView = (context) => {
    return new Text(labels.setLanguage[context.lang])
        .addReplyKeyboard([[labels.language.en, labels.language.ua], [backCommand.title[context.lang]]], true)
        .get();
};

exports.initNewUserChangeLangView = () => {
    return new Text(commands.SET_LANG.title.ua)
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
        throw new Error(unknownCommandLabel[context.lang]);
    }
    context.userState.updated = labels.updatedParamLang[context.lang];
};

exports.setRadius = (context) => {
    if (typeof context.inputData !== 'string' || context.inputData === '') {
        throw new Error(labels.incorrectRadius[context.lang]);
    }
    const radius =
        context.inputData.endsWith('km') || context.inputData.endsWith('км')
            ? +context.inputData.substr(0, context.inputData.length - 2).trim()
            : +context.inputData;

    if (!Number.isInteger(radius) || radius < 1 || radius > 50) {
        throw new Error(labels.incorrectRadius[context.lang]);
    }

    context.userState.searchRadius = radius;
    context.userState.updated = labels.updatedParamRadius[context.lang];
};

exports.setLocation = async (context) => {
    if (!context.inputData || !context.inputData.latitude || !context.inputData.longitude) {
        throw new Error(labels.locationNotSet[context.lang]);
    }

    const newLocation = {
        type: 'Point',
        coordinates: [context.inputData.longitude, context.inputData.latitude]
    };
    await fetchUserAndUpdateAdvLoc(context.user.id, newLocation);
    context.userState.location = newLocation;
    context.userState.updated = labels.updatedParamLocation[context.lang];
};
