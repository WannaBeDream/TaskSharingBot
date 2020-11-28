const { verificationDataForCompliance } = require('./is-advertisement');
const userInputData = require('./user-input-data');
const { noSpace } = require('./reg-exp');
const { validatedConfig } = require('./config-validated');

module.exports = { verificationDataForCompliance, noSpace, userInputData, validatedConfig };
