const labels = require('./display-ads/labels');

exports.AD_TEMPLATE = (ad, lang) => {
    const renumeration = ad.renumeration ? `${ad.renumeration} 💰` : '';
    return `

[   ${labels.author[`${lang}`]}](tg://user?id=${ad.author})

❗️*${ad.title}*❗️

${ad.description}

${renumeration}

`;
};
