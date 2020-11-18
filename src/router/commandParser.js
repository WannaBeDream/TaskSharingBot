const userHomeCommands = require('../features/user-home/commands');
const settingsCommands = require('../features/user-settings/commands');
const generalCommands = require('./general-commands');

const allCommands = Object.values(settingsCommands)
    .concat(Object.values(userHomeCommands))
    .concat(Object.values(generalCommands));

module.exports = (text, lang) => {
    const command = allCommands.find((c) => {
        return c.title[`${lang}`] === text;
    });
    return !command ? generalCommands.DATA_INPUT : command;
};
