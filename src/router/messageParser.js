const userHomeCommands = require('../features/user-home/commands');
const settingsCommands = require('../features/user-settings/commands');
const viewAdsCommands = require('../features/display-ads/commands');
const settingsAdCommands = require('../features/ad-setting/commands');
const adsDatainputCommands = require('../features/ad-categories');
const generalCommands = require('./general-commands');

const allCommands = Object.values(settingsCommands)
    .concat(Object.values(userHomeCommands))
    .concat(Object.values(generalCommands))
    .concat(Object.values(viewAdsCommands))
    .concat(Object.values(settingsAdCommands));

exports.parseCommand = (update, lang) => {
    const commandText = !update.originalRequest.callback_query ? update.text : JSON.parse(update.text).cmd;
    const command = allCommands.find((c) => {
        return c.title[`${lang}`] === commandText;
    });
    return command || generalCommands.DATA_INPUT;
};

exports.parseDataInput = (update, lang) => {
    const datainputCommand = Object.values(adsDatainputCommands).find((c) => {
        return c.title[`${lang}`] === update.text;
    });

    return (
        (datainputCommand && datainputCommand.id) ||
        (update.originalRequest.callback_query && JSON.parse(update.text).key) ||
        (update.originalRequest.message && update.originalRequest.message.location) ||
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
