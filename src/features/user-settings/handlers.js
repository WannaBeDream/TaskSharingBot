/* eslint-disable no-param-reassign */
const { telegramTemplate } = require('claudia-bot-builder');
const labels = require('./labels');
const commands = require('./commands');
const { GO_BACK: backCommand } = require('../../router/general-commands');
const { unknownCommand: unknownCommandLabel } = require('../../router/labels');

// ////////////////////////////////////////////////// //
//                  Display data                      //
// ////////////////////////////////////////////////// //

exports.initNewUserSetLocationView = (update) => {
    update.userState.act = 'USER_ACT';
    return new telegramTemplate.Text(labels.newUserEnterLocation[update.userState.lang]).replyKeyboardHide().get();
};
exports.initNewUserSetRadiusView = (update) => {
    update.userState.act = 'USER_ACT';
    // eslint-disable-next-line prettier/prettier
    return (
        new telegramTemplate.Text(labels.newUserEnterRadius[update.userState.lang])
            // eslint-disable-next-line prettier/prettier
            .addReplyKeyboard(
                [
                    ['1', '3', '5'],
                    ['10', '20', '50']
                ],
                true
            )
            .get()
    );
};
exports.initUserSettingsView = (update) => {
    update.userState.act = 'USER_ACT';
    const { lang } = update.userState;
    return new telegramTemplate.Text('\uD83D\uDE01')
        .addReplyKeyboard(
            [
                [commands.CHANGE_LOCATION.title[`${lang}`], commands.CHANGE_RADIUS.title[`${lang}`]],
                [commands.VIEW_PROFILE.title[`${lang}`]],
                [backCommand.title[`${lang}`], commands.CHANGE_LANG.title[`${lang}`]]
            ],
            true
        )
        .get();
};
exports.initChangeLocationView = (update) => {
    update.userState.act = 'USER_ACT';
    return [
        new telegramTemplate.Text(labels.existingUserChangeLocation[update.userState.lang]).get(),
        new telegramTemplate.Location(
            update.userState.location.coordinates[1],
            update.userState.location.coordinates[0]
        )
            .addReplyKeyboard([[backCommand.title[update.userState.lang]]], true)
            .get()
    ];
};

exports.initChangeRadiusView = (update) => {
    update.userState.act = 'USER_ACT';
    return new telegramTemplate.Text(
        labels.existingUserChangeRadius[update.userState.lang](update.userState.searchRadius)
    )
        .addReplyKeyboard([['1', '3', '5'], ['10', '20', '50'], [backCommand.title[update.userState.lang]]], true)
        .get();
};

exports.initViewProfileView = (update) => {
    update.userState.act = 'USER_ACT';
    const name = `${update.originalRequest.message.from.first_name} ${update.originalRequest.message.from.last_name}`;
    return [
        new telegramTemplate.Text(
            labels.userProfileData[update.userState.lang](name, update.userState.searchRadius)
        ).get(),
        new telegramTemplate.Location(
            update.userState.location.coordinates[1],
            update.userState.location.coordinates[0]
        )
            .addReplyKeyboard([[backCommand.title[update.userState.lang]]], true)
            .get()
    ];
};
exports.initChangeLangView = (update) => {
    update.userState.act = 'USER_ACT';
    return new telegramTemplate.Text('\uD83D\uDE01')
        .addReplyKeyboard([[labels.language.en, labels.language.ua], [backCommand.title[update.userState.lang]]], true)
        .get();
};
exports.initNewUserChangeLangView = (update) => {
    update.userState.act = 'USER_ACT';
    return new telegramTemplate.Text('\uD83D\uDE01')
        .addReplyKeyboard([[labels.language.en, labels.language.ua]], true)
        .get();
};

// ////////////////////////////////////////////////// //
//                      Set data                      //
// ////////////////////////////////////////////////// //

exports.setLanguage = (update) => {
    update.userState.act = 'USER_ACT';
    if (update.text === labels.language.en || update.text === 'en') {
        update.userState.lang = 'en';
    } else if (update.text === labels.language.ua || update.text === 'ua') {
        update.userState.lang = 'ua';
    } else {
        throw new Error(unknownCommandLabel[update.userState.lang]);
    }
};

exports.setRadius = (update) => {
    update.userState.act = 'USER_ACT';
    if (!Number.isInteger(+update.text) || +update.text < 1 || +update.text > 50) {
        throw new Error(labels.incorrectRadius[update.userState.lang]);
    }
    // eslint-disable-next-line no-param-reassign
    update.userState.searchRadius = +update.text;
};

exports.setLocation = (update) => {
    update.userState.act = 'USER_ACT';
    const { location } = update.originalRequest.message;
    if (!location) {
        throw new Error(labels.locationNotSet[update.userState.lang]);
    }
    // eslint-disable-next-line no-param-reassign
    update.userState.location = { type: 'Point', coordinates: [location.longitude, location.latitude] };
};
