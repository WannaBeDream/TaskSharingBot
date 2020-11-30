const { LOST_FOUND_ADS, SALES, SERVICES_OFFER, ASSISTANCE_SEARCH, BUY_STUFF } = require('../features/ad-categories');

const constants = {
    titleLength: { min: 5, max: 150 },
    descriptionLength: { min: 10, max: 1200 },
    remunerationLength: { min: 0, max: 80 },
    regExpForAd: {
        app: /^[а-яА-яЁёЇїІіЄєҐґ'-zA-Z0-9 ]*$/,
        mongo: `^[а-яА-яЁёЇїІіЄєҐґ'-zA-Z0-9 ]*$`
    },
    regExpForCategory: [LOST_FOUND_ADS.id, SALES.id, SERVICES_OFFER.id, ASSISTANCE_SEARCH.id, BUY_STUFF.id]
};

module.exports = constants;
