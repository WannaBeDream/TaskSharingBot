const Template = require('claudia-bot-builder').telegramTemplate;
const { MONGO_URI } = require('../../config');
const { logger } = require('../../helpers');
const { connect } = require('../../database/create-connection');

module.exports = async (message) => {
    logger.info(message);
    await connect(MONGO_URI);

    return new Template.Text(`${message.text}`).get();
};
