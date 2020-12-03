const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const messageParser = require('./message-parser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('../features/unknown-labels');
const { connectToDatabase } = require('../database/create-connection');
const { logger } = require('../helpers');

async function tryExecuteFunction(func, params, result) {
    const res = result;
    if (func) {
        const reply = await func(params);
        if (reply && Array.isArray(reply)) {
            res.push(...reply);
        } else if (reply) {
            res.push(reply);
        }
    }
    return res;
}

module.exports = async (update) => {
    try {
        // console.log(update.originalRequest.message || update.originalRequest.callback_query);
        await connectToDatabase(MONGO_URI);

        const user = messageParser.parseUser(update);
        const userState = await appStateDao.getUserState(user.id);

        const command = messageParser.parseCommand(
            update,
            Object.keys(STATE_MACHINE[userState.appStateId]),
            userState.lang
        );
        const transition = STATE_MACHINE[userState.appStateId][command.id];
        if (!transition) {
            return langResources.unknownCommand[userState.lang];
        }
        const inputData = messageParser.parseDataInput(update, userState.lang);
        const chatData = messageParser.parseChatData(update);
        const context = { user, userState, lang: userState.lang, inputData, ...chatData };

        let reply = [];
        reply = await tryExecuteFunction(transition.handler, context, reply);
        reply = await tryExecuteFunction(transition.targetState && transition.targetState.constructor, context, reply);

        await appStateDao.setUserState(user.id, {
            ...userState,
            ...(transition.targetState ? { appStateId: transition.targetState.id } : {}),
            lang: context.lang
        });
        return reply;
    } catch (error) {
        logger.error({
            timestamp: '',
            level: 'error',
            errorIn: 'router/index.js',
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        return error.message;
    }
};
