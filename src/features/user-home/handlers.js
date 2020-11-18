const { telegramTemplate } = require('claudia-bot-builder');
const labels = require('./labels');
const commands = require('./commands');

exports.initUserHomeView = (update) => {
    return new telegramTemplate.Text('\uD83D\uDE01')
        .addReplyKeyboard([[commands.USER_SETTINGS.title[update.userState.lang]]], true)
        .get();
};

exports.getUserGreeting = (update) => {
    const name = `${update.originalRequest.message.from.first_name} ${update.originalRequest.message.from.last_name}`;
    return new telegramTemplate.Text(labels.existingUserGreeting[update.userState.lang](name)).get();
};

exports.getNewUserGreeting = (update) => {
    const name = `${update.originalRequest.message.from.first_name} ${update.originalRequest.message.from.last_name}`;
    return new telegramTemplate.Text(labels.newUserGreeting[update.userState.lang](name)).get();
};
