const winston = require('winston');

const { createLogger, transports, format } = winston;
const { combine, timestamp, prettyPrint } = format;

const customFormat = () => {
    return combine(timestamp({ format: 'HH:mm:ss DD-MM-YYYY' }), prettyPrint());
};

module.exports.Logger = createLogger({
    transports: [
        new transports.Console({
            format: customFormat()
        })
    ]
});
