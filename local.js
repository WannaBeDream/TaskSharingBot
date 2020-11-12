/* eslint-disable import/no-extraneous-dependencies */
const ngrok = require('ngrok');
const axios = require('axios');
const express = require('express');
const config = require('./src/config');
const parser = require('claudia-bot-builder/lib/telegram/parse');
const responder = require('claudia-bot-builder/lib/telegram/reply');

const messageHandler = require('./src/features');

(async () => {
  try {
    const port = 3003;
    const webhookPath = '/webhook';
    const token = config.BOT_TOKEN;

    if (!token) {
      throw new Error("Cann't find TEST_BOT_TOKEN in your environments");
    }

    try {
      const url = await ngrok.connect(port);

      await axios({
        method: 'GET',
        url: `https://api.telegram.org/bot${token}/setWebhook?url=${url}${webhookPath}`,
      });
    } catch (err) {
      throw new Error(`Cann't setup webhook, reason: ${err.message}`);
    }

    const app = express();

    app.use(express.json());

    app.post(webhookPath, async (req, res) => {
      const parsedMessage = parser(req.body);
      const botResponse = await messageHandler(parsedMessage);

      responder(parsedMessage, botResponse, token);

      res.sendStatus(200);
    });

    app.listen(port, () => process.stdout.write(`Server started at port ${port}\n`));
  } catch (err) {
    process.stdout.write(`${err.message}\n`);
  }
})();
