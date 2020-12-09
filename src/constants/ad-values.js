const {
    LOST_FOUND_STUFF,
    SALES_STUFF,
    SERVICES_STUFF,
    GIVE_STUFF,
    BUY_STUFF,
    OTHER_STUFF
} = require('../features/ad-categories');

const constants = {
    titleLength: { min: 1, max: 100 },
    descriptionLength: { min: 1, max: 800 },
    remunerationLength: { min: 0, max: 80 },
    strArrForCategory: [LOST_FOUND_STUFF.id, GIVE_STUFF.id, SERVICES_STUFF.id, SALES_STUFF.id, BUY_STUFF.id],
    strArrForCategoryAll: [
        LOST_FOUND_STUFF.id,
        GIVE_STUFF.id,
        SERVICES_STUFF.id,
        SALES_STUFF.id,
        BUY_STUFF.id,
        OTHER_STUFF.id
    ]
};

module.exports = constants;
