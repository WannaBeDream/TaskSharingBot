/* eslint-disable security/detect-object-injection */
const { LOST_FOUND_ADS, SALES, SERVICES_OFFER, ASSISTANCE_SEARCH, BUY_STUFF } = require('../../features/ad-categories');

const constants = {
    longSmallTitleValue: { min: 5, max: 15 },
    longSmallDescriptionValue: { min: 10, max: 200 },
    longSmallRenumerationValue: { min: 0, max: 20 },
    // eslint-disable-next-line no-useless-escape
    regExpForAdv: { app: /^[а-яА-яЁёЇїІіЄєҐґ'-zA-Z0-9 ]*$/, mongo: `^[а-яА-яЁёЇїІіЄєҐґ'-zA-Z0-9 ]*$` },
    regExpForCateg: [LOST_FOUND_ADS.id, SALES.title.id, SERVICES_OFFER.id, ASSISTANCE_SEARCH.id, BUY_STUFF.id]
};
module.exports = constants;
