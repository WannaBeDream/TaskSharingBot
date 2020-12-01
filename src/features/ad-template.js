const labels = require('./display-ads/labels');
const { SPAM_COUNTER } = require('../constants/db-values');

exports.AD_TEMPLATE = (ad, lang, keyboard) => {
    const renumeration = ad.renumeration ? `💰 ${ad.renumeration}` : '';
    const author =
        // eslint-disable-next-line no-nested-ternary
        ad.spam.length >= SPAM_COUNTER
            ? `*${labels.deletedSpam[`${lang}`]}*`
            : ad.author
            ? `[${labels.author[`${lang}`]}](tg://user?id=${ad.author})`
            : `*${labels.deleted[`${lang}`]}*`;
    if (ad.imgId) {
        let caption = `\u26A1 *${ad.title}*
${renumeration}
            
${ad.description}
            
${author}`;
        if (caption.length > 1024) {
            const description = ad.description.slice(0, ad.description.length - (caption.length - 1024) - 3);
            caption = `\u26A1 *${ad.title}*
${renumeration}
        
${description}...
        
${author}`;
        }
        return {
            method: 'sendPhoto',
            body: {
                photo: `${ad.imgId}`,
                caption,
                parse_mode: 'Markdown',
                reply_markup: JSON.stringify(keyboard)
            }
        };
    }

    return `\u26A1 *${ad.title}*
${renumeration}
${ad.description}
${author}`;
};
