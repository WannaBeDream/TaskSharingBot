const { Text, Location } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const markdownUtils = require('../../helpers/markdown-utils');

function homeKeyboard(context) {
    return [
        [commands.CREATE_AD.title[context.lang], commands.OWN_ADS.title[context.lang]],
        [commands.LOCAL_ADS.title[context.lang], commands.SELECTED_ADS.title[context.lang]],
        [commands.USER_SETTINGS.title[context.lang]]
    ];
}
function formatName(context) {
    return markdownUtils.formatPlainText(`${context.user.firstName}`);
}

exports.renderUserHomeView = (context) => {
    return new Text(labels.userHome[context.lang]).addReplyKeyboard(homeKeyboard(context), true).get();
};

exports.renderUserGreetingView = (context) => {
    return new Text(labels.newUserGreeting[context.lang](formatName(context))).get();
};

exports.renderBotRestartView = (context) => {
    const userSettings = context.userState;
    return [
        new Text(labels.botRestartUserGreeting[context.lang](formatName(context), userSettings.searchRadius)).get(),
        new Location(userSettings.location.coordinates[1], userSettings.location.coordinates[0])
            .addReplyKeyboard(homeKeyboard(context), true)
            .get()
    ];
};
