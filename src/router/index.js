const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const messageParser = require('./message-parser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('../features/unknown-labels');
const { connectToDatabase } = require('../database/create-connection');
const { logger } = require('../helpers');
const CustomException = require('../helpers/exeptions');

async function tryExecuteFunction(func, params) {
    if (!func) {
        return [];
    }
    const reply = await func(params);
    return !reply ? [] : Array.isArray(reply) ? reply : [reply];
}

module.exports = async (update) => {
    try {
        // console.log(update.originalRequest.message || update.originalRequest.callback_query);
        await connectToDatabase(MONGO_URI);

        const user = messageParser.parseUser(update);
        const { _id, lang, location, searchRadius, state } = await appStateDao.getUserState(user.id);
        const userState = { _id, lang, location, searchRadius, ...state };

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

        const handlerReply = await tryExecuteFunction(transition.handler, context);
        const targetStateReply = await tryExecuteFunction(
            transition.targetState && transition.targetState.renderer,
            context
        );

        await appStateDao.setUserState({
            ...userState,
            ...(transition.targetState ? { appStateId: transition.targetState.id } : {}),
            lang: context.lang
        });

        return handlerReply.concat(targetStateReply);
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        if (error instanceof CustomException) {
            return error.message;
        }
        const { language_code: lang } = update.originalRequest.callback_query.from;
        return lang === 'ua' || lang === 'ru' ? langResources.unknownAction.ua : langResources.unknownAction.en;
    }
};
