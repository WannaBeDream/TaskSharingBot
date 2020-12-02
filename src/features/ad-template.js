const labels = require('./display-ads/labels');
const { SPAM_COUNTER } = require('../constants/db-values');

function createTemplateText(title, description, renumeration, author) {
    return `\u26A1 *${title}*
${renumeration}
${description}
${author}`;
}

function checkAd(ad, lang) {
    // eslint-disable-next-line no-nested-ternary
    return ad.spam.length >= SPAM_COUNTER
        ? `*${labels.deletedSpam[`${lang}`]}*`
        : ad.author
        ? `[${labels.author[`${lang}`]}](tg://user?id=${ad.author})`
        : `*${labels.deleted[`${lang}`]}*`;
}

exports.AD_TEMPLATE = (ad, lang) => {
    const renumeration = ad.renumeration ? `💰 ${ad.renumeration}` : '';
    const author = checkAd(ad, lang);
    return createTemplateText(ad.title, ad.description, renumeration, author);
};
