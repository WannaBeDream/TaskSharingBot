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
    return markdownUtils.formatPlainText(`${context.user.name}`);
}

exports.renderUserHomeView = (context) => {
    return new Text(labels.userHome[context.lang]).addReplyKeyboard(homeKeyboard(context), true).get();
};

exports.renderUserGreetingView = (context) => {
    return new Text(labels.newUserGreeting[context.lang](formatName(context))).get();
};

exports.renderBotRestartView = (context) => {
    return [
        new Text(labels.botRestartUserGreeting[context.lang](formatName(context), context.user.searchRadius)).get(),
        new Location(context.user.location.coordinates[1], context.user.location.coordinates[0])
            .addReplyKeyboard(homeKeyboard(context), true)
            .get()
    ];
};
