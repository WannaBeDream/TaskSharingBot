const labels = require('./display-ads/labels');

exports.AD_TEMPLATE = (update, title, author, description, renumeration) => {
    return `

[   ${labels.author[update.userState.lang]}](tg://user?id=${author})

❗️*${title}*❗️

${description}

🎁   ${renumeration}   🎁

`;
};
