const validator = require('validator');
const { logger } = require('../../helpers');

const userInputData = {
    ifStrCondition: (str, value, regExp) =>
        !validator.isLength(str, value.min, value.max) || !validator.matches(str, regExp),
    ifStrContain: (str, phrases) => {
        const res = phrases.includes(str);
        logger.info(res);
        return !res;
    }
};

module.exports = { userInputData };
