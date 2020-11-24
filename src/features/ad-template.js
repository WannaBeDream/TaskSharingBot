const labels = require('./display-ads/labels');

exports.AD_TEMPLATE = (ad, lang) => {
    return `

[   ${labels.author[`${lang}`]}](tg://user?id=${ad.author})

❗️*${ad.title}*❗️

${ad.description}

🎁   ${ad.renumeration}   🎁

`;
};
