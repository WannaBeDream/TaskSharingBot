const botBuilder = require('claudia-bot-builder');

const messageHandler = require('./features');

module.exports = botBuilder(messageHandler);
