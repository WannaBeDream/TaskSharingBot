const { Text } = require('claudia-bot-builder').telegramTemplate;
const labels = require('./labels');
const commands = require('./commands');

exports.initUserHomeView = (context) => {
    return new Text('🏠')
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

exports.getUserGreeting = (context) => {
    const name = `${context.user.firstName} ${context.user.lastName}`;
    return new Text(labels.existingUserGreeting[context.lang](name)).get();
};

exports.getNewUserGreeting = (context) => {
    const name = `${context.user.firstName} ${context.user.lastName}`;
    return new Text(labels.newUserGreeting[context.lang](name)).get();
};
