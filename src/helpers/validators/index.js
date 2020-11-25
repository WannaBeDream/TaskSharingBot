const validate = require('validate.it.js');

const validators = {
    ifStrLongerThen: (message, value) => validate(`${message}`).longerThan(value).ok
};

module.exports = validators;
