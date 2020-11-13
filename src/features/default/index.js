const Template = require('claudia-bot-builder').telegramTemplate;

const { logger } = require('../../helpers');

module.exports = (message) => {
    logger.info(message);

    return new Template.Text(`${message.text}`).get();
};
