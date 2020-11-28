const botBuilder = require('claudia-bot-builder');

const messageHandler = require('./router');

module.exports = botBuilder(messageHandler, { platforms: ['telegram'] });
