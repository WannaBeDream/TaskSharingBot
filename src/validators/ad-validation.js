const validator = require('validator');

const userInputData = {
    ifStrCondition: (str, value) => !validator.isLength(str, value.min, value.max),
    ifStrContain: (str, phrases) => {
        const res = phrases.includes(str);
        return !res;
    }
};

module.exports = { userInputData };
