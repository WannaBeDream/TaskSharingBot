const { Text, Location } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const { GO_BACK: backCommand } = require('../../router/general-commands');
const { unknownCommand: unknownCommandLabel } = require('../../router/labels');

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.initNewUserSetLocationView = (context) => {
    return new Text(labels.newUserEnterLocation[context.lang]).replyKeyboardHide().get();
};
exports.initNewUserSetRadiusView = (context) => {
    return new Text(labels.newUserEnterRadius[context.lang])
        .addReplyKeyboard([['1', '3', '5'], ['10', '20', '50'], []], true)
        .get();
};
exports.initUserSettingsView = (context) => {
    return new Text('🙎')
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
    return [
        new Text(labels.existingUserChangeLocation[context.lang]).get(),
        new Location(context.userState.location.coordinates[1], context.userState.location.coordinates[0])
            .addReplyKeyboard([[backCommand.title[context.lang]]], true)
            .get()
    ];
};
exports.initChangeRadiusView = (context) => {
    return new Text(labels.existingUserChangeRadius[context.lang](context.userState.searchRadius))
        .addReplyKeyboard([['1', '3', '5'], ['10', '20', '50'], [backCommand.title[context.lang]]], true)
        .get();
};
exports.initViewProfileView = (context) => {
    const name = `${context.user.firstName} ${context.user.lastName}`;
    return [
        new Text(labels.userProfileData[context.lang](name, context.userState.searchRadius)).get(),
        new Location(context.userState.location.coordinates[1], context.userState.location.coordinates[0])
            .addReplyKeyboard([[backCommand.title[context.lang]]], true)
            .get()
    ];
};
exports.initChangeLangView = (context) => {
    return new Text('\uD83D\uDE01')
        .addReplyKeyboard([[labels.language.en, labels.language.ua], [backCommand.title[context.lang]]], true)
        .get();
};
exports.initNewUserChangeLangView = () => {
    return new Text('\uD83D\uDE01').addReplyKeyboard([[labels.language.en, labels.language.ua]], true).get();
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
};
exports.setRadius = (context) => {
    if (!Number.isInteger(+context.inputData) || +context.inputData < 1 || +context.inputData > 50) {
        throw new Error(labels.incorrectRadius[context.lang]);
    }
    context.userState.searchRadius = +context.inputData;
};
exports.setLocation = (context) => {
    if (!context.inputData || !context.inputData.latitude || !context.inputData.longitude) {
        throw new Error(labels.locationNotSet[context.lang]);
    }
    context.userState.location = {
        type: 'Point',
        coordinates: [context.inputData.longitude, context.inputData.latitude]
    };
};
