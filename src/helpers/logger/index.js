const logger = {
  info: (message) => process.stdout.write(`[info] ${JSON.stringify(message, null, 2)}\n`),
  error: (message, error) => process.stdout.write(`[error] ${message}\n${JSON.stringify(error)}\n`),
};

module.exports = logger;
