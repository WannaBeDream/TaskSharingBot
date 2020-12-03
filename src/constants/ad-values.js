const { LOST_FOUND_ADS, SALES, SERVICES_OFFER, ASSISTANCE_SEARCH, BUY_STUFF } = require('../features/ad-categories');

const constants = {
    titleLength: { min: 1, max: 100 },
    descriptionLength: { min: 1, max: 800 },
    remunerationLength: { min: 0, max: 80 },
    strArrForCategory: [LOST_FOUND_ADS.id, SALES.id, SERVICES_OFFER.id, ASSISTANCE_SEARCH.id, BUY_STUFF.id]
};

module.exports = constants;
