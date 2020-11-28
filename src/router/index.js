const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const messageParser = require('./message-parser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('../features/unknown-labels');
const { connectToDatabase } = require('../database/create-connection');
const { verificationDataForCompliance, noSpace } = require('../validators');

async function tryExecuteFunction(func, params, result) {
    if (func) {
        const reply = await func(params);
        if (reply && Array.isArray(reply)) {
            result.push(...reply);
        } else if (reply) {
            result.push(reply);
        }
    }
}

module.exports = async (update) => {
    try {
        console.log(update.originalRequest.message || update.originalRequest.callback_query);
        // https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/#example
        await connectToDatabase(MONGO_URI);

        const user = messageParser.parseUser(update);
        const userState = await appStateDao.getUserState(user.id);

        const command = messageParser.parseCommand(update, userState.lang);
        const transition = STATE_MACHINE[userState.appStateId][command.id];
        if (!transition) {
            return langResources.unknownCommand[userState.lang];
        }
        const inputData = messageParser.parseDataInput(update, userState.lang);
        const chatData = messageParser.parseChatData(update);
        const context = { user, userState, lang: userState.lang, inputData, ...chatData };

        const reply = [];
        await tryExecuteFunction(transition.handler, context, reply);
        await tryExecuteFunction(transition.targetState && transition.targetState.constructor, context, reply);

        if (inputData.length === 24 && noSpace.test(inputData)) {
            const result = await verificationDataForCompliance(inputData);

            if (result) {
                await appStateDao.setUserState(user.id, {
                    ...userState,
                    ...(transition.targetState ? { appStateId: transition.targetState.id } : {}),
                    lang: context.lang,
                    currentUpdateAd: inputData
                });
                return reply;
            }
        }

        await appStateDao.setUserState(user.id, {
            ...userState,
            ...(transition.targetState ? { appStateId: transition.targetState.id } : {}),
            lang: context.lang
        });
        return reply;
    } catch (error) {
        console.error(error);
        return error.message;
    }
};
