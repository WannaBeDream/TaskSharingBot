const { LOST_FOUND_ADS, ASSISTANCE_SEARCH, BUY_STUFF, SALES, SERVICES_OFFER } = require('./ad-categories');

module.exports = {
    checkMaxMinReg: {
        en: (min, max) => `You entered less then ${min} or more then ${max} symbols.`,
        ua: (min, max) => `Ви ввели менше ніж ${min} або більше ніж ${max} символів.`
    },
    categoryError: {
        en:
            'To select a category - use the action buttons or write yourself by selecting the appropriate category:\n' +
            `1. ${LOST_FOUND_ADS.title.en}\n` +
            `2. ${ASSISTANCE_SEARCH.title.en}\n` +
            `3. ${BUY_STUFF.title.en}\n` +
            `4. ${SALES.title.en}\n` +
            `5. ${SERVICES_OFFER.title.en}\n`,
        ua:
            'Щоб обрати категорію - скористайтесь кнопками дій або напишіть самі, обравши відповідну категорію:\n' +
            `1. ${LOST_FOUND_ADS.title.ua}\n` +
            `2. ${ASSISTANCE_SEARCH.title.ua}\n` +
            `3. ${BUY_STUFF.title.ua}\n` +
            `4. ${SALES.title.ua}\n` +
            `5. ${SERVICES_OFFER.title.ua}\n`
    }
};
