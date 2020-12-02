const labels = require('./display-ads/labels');
const { SPAM_COUNTER } = require('../constants/db-values');

exports.AD_TEMPLATE = (ad, lang) => {
    const remuneration = ad.renumeration ? `💰 ${ad.renumeration}` : '';
    const author =
        ad.spam.length >= SPAM_COUNTER
            ? `*${labels.deletedSpam[`${lang}`]}*`
            : ad.author
            ? `[${labels.author[`${lang}`]}](tg://user?id=${ad.author})`
            : `*${labels.deleted[`${lang}`]}*`;
    return `\u26A1 *${ad.title}*
${remuneration}

 ${ad.description}

${author}`;
};
