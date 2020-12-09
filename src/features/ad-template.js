const labels = require('./display-ads/labels');
const { SPAM_COUNTER } = require('../constants/db-values');
const markdownUtils = require('../helpers/markdown-utils');

function createTemplateText(title, description, renumeration, author) {
    const titlePreview = `🗣️  ${markdownUtils.formatBoldText(title)}`;
    const remunerationPreview = markdownUtils.formatPlainText(renumeration);
    const descriptionPreview = `📝  ${markdownUtils.formatPlainText(description)}`;
    const authorPreview = `➡️  ${author}`;

    return `${titlePreview}${remunerationPreview}\n\n${descriptionPreview}\n\n${authorPreview}`;
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
    const remuneration = ad.renumeration ? `\n\n💰 ${ad.renumeration}` : '';
    const author = checkAd(ad, lang);
    return createTemplateText(ad.title, ad.description, remuneration, author);
};
