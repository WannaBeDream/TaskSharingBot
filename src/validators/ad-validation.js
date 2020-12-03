const validator = require('validator');
const { logger } = require('../helpers');

const userInputData = {
    ifStrCondition: (str, value) => !validator.isLength(str, value.min, value.max),
    ifStrContain: (str, phrases) => {
        const res = phrases.includes(str);
        logger.info(res);
        return !res;
    }
};

module.exports = { userInputData };
