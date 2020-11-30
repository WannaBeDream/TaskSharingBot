const validator = require('validator');

const userInputData = {
    ifStrCondition: async (str, value, regExp) =>
        !validator.isLength(str, value.min, value.max) || validator.matches(str, regExp) // regExp не работает
};

module.exports = { userInputData };
