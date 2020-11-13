const dotenv = require('dotenv');

const ENV = process.env;
const envName = ENV.NODE_ENV === 'PROD' ? 'env' : 'env.test';

dotenv.config({ path: `src/config/.${envName}` });

module.exports = {
    BOT_TOKEN: ENV.BOT_TOKEN,
    MONGO_URI: ENV.MONGO_URI
};
