const labels = require('./display-ads/labels');
const { SPAM_COUNTER } = require('../constants/db-values');

exports.AD_TEMPLATE = (ad, lang) => {
    const renumeration = ad.renumeration ? `💰 ${ad.renumeration}` : '';
    const author =
        // eslint-disable-next-line no-nested-ternary
        ad.spam.length >= SPAM_COUNTER
            ? `*${labels.deletedSpam[`${lang}`]}*`
            : ad.author
            ? `[${labels.author[`${lang}`]}](tg://user?id=${ad.author})`
            : `*${labels.deleted[`${lang}`]}*`;
    return `\u26A1 *${ad.title}*
${renumeration}

 ${ad.description}

${author}`;
};
