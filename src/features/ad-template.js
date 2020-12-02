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

function reduceText(ad, renumeration, author, length) {
    const description = ad.description.slice(0, ad.description.length - (length - 1024) - 3).concat('...');
    return createTemplateText(ad.title, description, renumeration, author);
}

exports.AD_TEMPLATE = (ad, lang, keyboard) => {
    const renumeration = ad.renumeration ? `💰 ${ad.renumeration}` : '';
    const author = checkAd(ad, lang);
    if (ad.imgId) {
        let caption = createTemplateText(ad.title, ad.description, renumeration, author);
        if (caption.length > 1024) {
            caption = reduceText(ad, renumeration, author, caption.length);
        }
        return {
            method: 'sendPhoto',
            body: {
                photo: `${ad.imgId}`,
                caption,
                parse_mode: 'Markdown',
                reply_markup: keyboard
            }
        };
    }

    return createTemplateText(ad.title, ad.description, renumeration, author);
};

exports.AD_TEMPLATE_TEXT = (ad, lang) => {
    const renumeration = ad.renumeration ? `💰 ${ad.renumeration}` : '';
    const author = checkAd(ad, lang);

    let caption = createTemplateText(ad.title, ad.description, renumeration, author);
    if (caption.length > 1024) {
        caption = reduceText(ad, renumeration, author, caption.length);
    }
    return caption;
};
