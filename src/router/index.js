const { MONGO_URI } = require('../config');
const appStateDao = require('./app-state-mongo');
const commandParser = require('./commandParser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('./labels');
const { connect } = require('../database/create-connection');

module.exports = async (update) => {
    // connect to mongo
    await connect(MONGO_URI); // create try catch

    // get Id
    const userId = update.originalRequest.message.from.id;

    // get user`s state
    const userState = await appStateDao.getUserState(userId);

    // parse input command
    const command = commandParser(update.text, userState.lang);

    //
    const transition = STATE_MACHINE[userState.appStateId][command.id];

    if (!transition) {
        return langResources.unknownCommand[userState.lang];
    }
    // eslint-disable-next-line no-param-reassign
    update.userState = userState;
    try {
        const reply = [];
        if (transition.handler) {
            const commandProcessResult = transition.handler(update);
            if (commandProcessResult) {
                reply.push(commandProcessResult);
            }
        }
        const markup = transition.targetState.constructor(update);
        if (Array.isArray(markup)) {
            reply.push(...markup);
        } else {
            reply.push(markup);
        }
        await appStateDao.setUserState(userId, { ...userState, appStateId: transition.targetState.id });
        return reply;
    } catch (error) {
        return error.message;
    }
};
