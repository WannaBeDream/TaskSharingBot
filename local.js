/* eslint-disable import/no-extraneous-dependencies */
const ngrok = require('ngrok');
const axios = require('axios');
const express = require('express');
const parser = require('claudia-bot-builder/lib/telegram/parse');
const responder = require('claudia-bot-builder/lib/telegram/reply');
const config = require('./src/config');

const router = require('./src/router');

(async () => {
    try {
        const port = 3005;
        const webhookPath = '/webhook';
        const token = config.BOT_TOKEN;

        if (!token) {
            throw new Error("Cann't find TEST_BOT_TOKEN in your environments");
        }

        try {
            const url = await ngrok.connect(port);

            await axios({
                method: 'GET',
                url: `https://api.telegram.org/bot${token}/setWebhook?url=${url}${webhookPath}`
            });
        } catch (err) {
            throw new Error(`Cann't setup webhook, reason: ${err.message}`);
        }

        const app = express();

        app.use(express.json());

        app.post(webhookPath, async (req, res) => {
            const parsedMessage = parser(req.body);
            const botResponse = await router(parsedMessage);

            responder(parsedMessage, botResponse, token);

            res.sendStatus(200);
        });

        app.listen(port, () => console.log(`Server started at port ${port}\n`));
    } catch (err) {
        console.error(`${err.message}\n`);
    }
})();
