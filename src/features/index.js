require('../config');

const defaultHandler = require('./default');
const { logger } = require('../helpers');

module.exports = async (webhook) => {
    logger.info(webhook);

    const { message } = webhook.originalRequest;

    return defaultHandler(message);
};
