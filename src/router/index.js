const { MONGO_URI } = require('../config');
const { connectToDatabase } = require('../database/create-connection');
const messageParser = require('./message-parser');
const appStates = require('./app-states');
const STATE_MACHINE = require('./state-machine');
const BotContext = require('../BotContext');
const labels = require('./labels');
const { logger } = require('../helpers');
const CustomException = require('../helpers/exeptions');

const { findUser } = require('../database/methods/find');
const { createUser } = require('../database/methods/create');
const { updateUserAppState } = require('../database/methods/update');

async function getUserState(userId) {
    let user = await findUser(userId);
    if (!user) {
        user = { _id: userId, appStateId: appStates.NEW_USER_START.id, lang: 'ua' };
        await createUser(user);
    }
    return user;
}

async function tryExecuteFunction(func, params) {
    if (!func) {
        return [];
    }
    const reply = await func(params);
    return !reply ? [] : Array.isArray(reply) ? reply : [reply];
}

module.exports = async (update) => {
    // console.log(update.originalRequest.message || update.originalRequest.callback_query);
    await connectToDatabase(MONGO_URI);

    const user = messageParser.parseUser(update);
    const userState = await getUserState(user.id);
    try {
        const command = messageParser.parseCommand(
            update,
            Object.keys(STATE_MACHINE[userState.appStateId]),
            userState.lang
        );
        const transition = STATE_MACHINE[userState.appStateId][command.id];
        if (!transition) {
            return labels.unknownCommand[userState.lang];
        }

        const context = BotContext.createImmutableBotContext(
            { ...user, ...userState },
            messageParser.parseDataInput(update, userState.lang),
            messageParser.parseChatData(update)
        );

        const handlerReply = await tryExecuteFunction(transition.handler, context);
        const targetStateReply = await tryExecuteFunction(
            transition.targetState && transition.targetState.renderer,
            context
        );

        await updateUserAppState(
            user.id,
            transition.targetState ? transition.targetState.id : userState.appStateId,
            context.userStateDataHolder.data
        );

        return handlerReply.concat(targetStateReply);
    } catch (error) {
        logger.error({ level: 'error', message: error.message, stack: error.stack });
        if (error instanceof CustomException) {
            return error.message;
        }
        return labels.unknownError[userState.lang];
    }
};
