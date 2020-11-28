const envalid = require('envalid');

const { str, url } = envalid;

module.exports.validatedConfig = () => {
    envalid.cleanEnv(process.env, {
        BOT_TOKEN: str(),
        MONGO_URI: url()
    });
};
