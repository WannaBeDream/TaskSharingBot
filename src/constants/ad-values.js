const {
    LOST_FOUND_STUFF,
    SERVICES_OFFER,
    ASSISTANCE_SEARCH,
    SALES_STUFF,
    GIVE_STUFF,
    BUY_STUFF
} = require('../features/ad-categories');

const constants = {
    titleLength: { min: 1, max: 100 },
    descriptionLength: { min: 1, max: 800 },
    remunerationLength: { min: 0, max: 80 },
    strArrForCategory: [
        LOST_FOUND_STUFF.id,
        GIVE_STUFF.id,
        SERVICES_OFFER.id,
        SALES_STUFF.id,
        BUY_STUFF.id,
        ASSISTANCE_SEARCH.id
    ],
    strArrForCategoryAll: [
        LOST_FOUND_STUFF.id,
        GIVE_STUFF.id,
        SERVICES_OFFER.id,
        SALES_STUFF.id,
        BUY_STUFF.id,
        ASSISTANCE_SEARCH.id
    ]
};

module.exports = constants;
