const ngrok = require('ngrok');
const axios = require('axios');
const express = require('express');
const parser = require('claudia-bot-builder/lib/telegram/parse');
const responder = require('claudia-bot-builder/lib/telegram/reply');

const { validatedConfig } = require('./src/validators');
const router = require('./src/router');

validatedConfig();

const start = async () => {
    try {
        const port = 3005;
        const webhookPath = '/webhook';
        const token = process.env.BOT_TOKEN;

        const app = express();
        app.use(express.json());

        app.post(webhookPath, async (req, res) => {
            const parsedMessage = parser(req.body);
            const botResponse = await router(parsedMessage);

            responder(parsedMessage, botResponse, token);
            res.sendStatus(200);
        });

        const ngrokUrl = await ngrok.connect(port);
        const axiosUrl = `https://api.telegram.org/bot${token}/setWebhook?url=${ngrokUrl}${webhookPath}`;
        await axios({ method: 'GET', url: axiosUrl });

        app.listen(port, () => console.info(`Server listen port ${port}...`));
    } catch (e) {
        console.error(e.message);
    }
};

start()
    .then(() => console.info('Have a nice work at local environment...'))
    .catch(() => console.error('Something went wrong'));
