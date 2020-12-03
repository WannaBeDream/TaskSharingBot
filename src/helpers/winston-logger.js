const winston = require('winston');

const { createLogger, transports, format } = winston;
const { combine, timestamp, prettyPrint, colorize } = format;

const customFormat = () => {
    return combine(timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }), prettyPrint(), colorize({ all: true }));
};

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'error',
            format: customFormat()
        })
    ]
});

module.exports = logger;
