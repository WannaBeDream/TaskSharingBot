/* eslint-disable no-param-reassign */
const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const messageParser = require('./messageParser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('./labels');
const { connectToDatabase } = require('../database/create-connection');

module.exports = async (update) => {
    try {
        console.log(update.originalRequest.message || update.originalRequest.callback_query);
        // https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/#example
        await connectToDatabase(MONGO_URI);

        // Todo. Most likely we should add this to the context too.
        // :
        // :         chat_id: update.originalRequest.callback_query.from.id,
        // :         message_id: update.originalRequest.callback_query.message.message_id
        // :
        // (parse update Object only in messageParser)

        const user = messageParser.parseUser(update);
        const userState = await appStateDao.getUserState(user.id);

        const command = messageParser.parseCommand(update, userState.lang);
        const transition = STATE_MACHINE[userState.appStateId][command.id];
        if (!transition) {
            return langResources.unknownCommand[userState.lang];
        }

        const inputData = messageParser.parseDataInput(update, userState.lang);
        const context = { user, userState, lang: userState.lang, inputData };

        const reply = [];
        if (transition.handler) {
            const commandProcessResult = await transition.handler(context);
            if (commandProcessResult) {
                reply.push(commandProcessResult);
            }
        }
        const markup = await transition.targetState.constructor(context);
        if (Array.isArray(markup)) {
            reply.push(...markup);
        } else {
            reply.push(markup);
        }
        await appStateDao.setUserState(user.id, {
            ...userState,
            appStateId: transition.targetState.id,
            lang: context.lang
        });
        return reply;
    } catch (error) {
        console.error(error);
        return error.message;
    }
};
