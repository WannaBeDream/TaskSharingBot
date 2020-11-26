const validate = require('validate.it.js');

const validators = {
    ifStrLongerThen: async (message, value) => validate(`${message}`).longerThan(value).ok,
    ifStrContainChart: async (message, regExp) => validate(`${message}`).match(regExp).ok
};

module.exports = { validators };
