const appStateDao = require('./appStateDao');
const commandParser = require('./commandParser');
const STATE_MACHINE = require('./state-machine');
const langResources = require('./labels');

module.exports = async (update) => {
    console.log(update.originalRequest.message);
    const userId = update.originalRequest.message.from.id;
    const userState = await appStateDao.getUserState(userId);
    console.log(userState);
    const command = commandParser(update.text, userState.lang);
    console.log(command);
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
