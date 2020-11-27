const constants = {
    longSmallTitleValue: { min: 3, max: 10 },
    longSmallDescriptionValue: { min: 3, max: 10 },
    longSmallRenumerationValue: { min: 3, max: 10 },
    // eslint-disable-next-line no-useless-escape
    regExpForAdv: { app: /^[а-яА-ЯёЁa-zA-Z0-9]+$'/, mongo: `^[а-яА-ЯёЁa-zA-Z0-9]+$'` }
    // regExpForAdv.app не реагирует, а regExpForAdv.mongo реагирует
};

module.exports = constants;
