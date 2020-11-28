const dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.isProd' : '.env.isDev';

dotenv.config({ path: `src/config/${envFile}` });

module.exports = Object.freeze({
    BOT_TOKEN: process.env.BOT_TOKEN,
    MONGO_URI: process.env.MONGO_URI
});
