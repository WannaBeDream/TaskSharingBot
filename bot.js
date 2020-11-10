'use strict'

const botBuilder = require('claudia-bot-builder');
const telegramTemplate = botBuilder.telegramTemplate;

module.exports = botBuilder(message => {
  if (message.type === 'telegram')
    return new telegramTemplate.Text(`What's your favorite House in Game Of Thrones`)
      .addReplyKeyboard([['Stark'], ['Lannister'], ['Targaryen'], ['None of the above']])
      .get();
});
