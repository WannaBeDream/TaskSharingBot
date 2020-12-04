const winston = require('winston');

const { createLogger, transports, format } = winston;

const logger = createLogger({
    transports: [
        new transports.Console({
            format: format.json()
        })
    ]
});

module.exports = logger;
