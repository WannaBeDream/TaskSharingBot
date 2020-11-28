const userHomeCommands = require('../features/user-home/commands');
const settingsCommands = require('../features/user-settings/commands');
const viewAdsCommands = require('../features/display-ads/commands');
const settingsAdCommands = require('../features/ad-setting/commands');
const adsDatainputCommands = require('../features/ad-categories');
const generalCommands = require('../features/general-commands');

const allCommands = Object.values(settingsCommands)
    .concat(Object.values(userHomeCommands))
    .concat(Object.values(generalCommands))
    .concat(Object.values(viewAdsCommands))
    .concat(Object.values(settingsAdCommands));

function parseRegularCommand(update, lang) {
    return allCommands.find((c) => {
        return c.title[`${lang}`] === update.text;
    });
}
function parseCallbackCommand(update) {
    const commandText = JSON.parse(update.text).cmd;
    return allCommands.find((c) => {
        return c.id === commandText;
    });
}

exports.parseCommand = (update, lang) => {
    const isNotCallback = !update.originalRequest.callback_query;
    const command = isNotCallback ? parseRegularCommand(update, lang) : parseCallbackCommand(update);
    return command || generalCommands.DATA_INPUT;
};

exports.parseChatData = (update) => {
    return !update.originalRequest.callback_query
        ? {
              /* currently supported only for calback queries */
          }
        : {
              chat_id: update.originalRequest.callback_query.from.id,
              message_id: update.originalRequest.callback_query.message.message_id
          };
};

exports.parseDataInput = (update, lang) => {
    const datainputCommand = Object.values(adsDatainputCommands).find((c) => {
        return c.title[`${lang}`] === update.text;
    });

    return (
        (datainputCommand && datainputCommand.id) ||
        (update.originalRequest.callback_query && JSON.parse(update.text).key) ||
        (update.originalRequest.message && update.originalRequest.message.location) ||
        update.originalRequest.message.photo ||
        update.text
    );
};

exports.parseUser = (update) => {
    const message = update.originalRequest.message || update.originalRequest.callback_query;
    return {
        id: message.from.id,
        firstName: message.from.first_name,
        lastName: message.from.last_name
    };
};
