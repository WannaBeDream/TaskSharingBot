/* eslint-disable no-param-reassign */
const { telegramTemplate } = require('claudia-bot-builder');
const labels = require('./labels');
const commands = require('./commands');
const { USER_ACT } = require('../constants');

exports.initUserHomeView = (update) => {
    update.userState.act = USER_ACT;
    return new telegramTemplate.Text('\uD83D\uDE01')
        .addReplyKeyboard(
            [
                [commands.CREATE_AD.title[update.userState.lang], commands.ALL_ADS.title[update.userState.lang]],
                [commands.MY_ADS.title[update.userState.lang], commands.USER_SAVED_ADS.title[update.userState.lang]],
                [commands.USER_SETTINGS.title[update.userState.lang]]
            ],
            true
        )
        .get();
};

exports.getUserGreeting = (update) => {
    update.userState.act = USER_ACT;
    const name = `${update.originalRequest.message.from.first_name} ${update.originalRequest.message.from.last_name}`;
    return new telegramTemplate.Text(labels.existingUserGreeting[update.userState.lang](name)).get();
};

exports.getNewUserGreeting = (update) => {
    update.userState.act = USER_ACT;
    const name = `${update.originalRequest.message.from.first_name} ${update.originalRequest.message.from.last_name}`;
    return new telegramTemplate.Text(labels.newUserGreeting[update.userState.lang](name)).get();
};
