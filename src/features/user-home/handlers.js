const { Text } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');
const markdownUtils = require('../../helpers/markdown-utils');

exports.initUserHomeView = (context) => {
    return new Text(labels.userHome[context.lang])
        .addReplyKeyboard(
            [
                [commands.CREATE_AD.title[context.lang], commands.OWN_ADS.title[context.lang]],
                [commands.LOCAL_ADS.title[context.lang], commands.SELECTED_ADS.title[context.lang]],
                [commands.USER_SETTINGS.title[context.lang]]
            ],
            true
        )
        .get();
};

function formatName(context) {
    return markdownUtils.formatPlainText(`${context.user.firstName}`);
}

exports.getUserGreeting = (context) => {
    return new Text(labels.existingUserGreeting[context.lang](formatName(context))).get();
};

exports.getNewUserGreeting = (context) => {
    return new Text(labels.newUserGreeting[context.lang](formatName(context))).get();
};
