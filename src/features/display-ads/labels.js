module.exports = {
    ifEmptyArrayMessage: {
        en: `No Ads were found`,
        ua: `Оголошень не знайдено`
    },
    pageNumber: {
        en: (page) => `Page ${page}`,
        ua: (page) => `Сторінка ${page}`
    },
    foundAdsRange: {
        en: (start, end) => `Ads from the ${start} to the the ${end}`,
        ua: (start, end) => `Оголошення з ${start} по ${end}`
    },
    author: {
        en: `Link to the author`,
        ua: `Посилання на автора`
    },
    deleted: {
        en: `\uD83D\uDEAB The Ad was deleted by its author.`,
        ua: `\uD83D\uDEAB Оголошення було видалене автором.`
    },
    deletedSpam: {
        en: `\uD83D\uDEAB The Ad was reported as SPAM by many! It's hidden from others now.`,
        ua: `\uD83D\uDEAB На це оголошення надійшло багато скарг! Воно зараз не відображається нікому.`
    },
    selectAdsCategory: {
        en: 'Please select Category',
        ua: 'Будь ласка, оберіть категорію'
    },
    editAdIsStarted: {
        en: `Ad editing process is started.\nPlease scroll down to enter data.`,
        ua: `Процес редагування оголошення розпочато. Прокрутіть вниз, щоб вводити дані.`
    },
    deactivateIsSet: {
        en: `The Ad is got deactivated and hidden from others`,
        ua: `Оголошення тепер деактивовано\nта буде приховано від інших`
    },
    activateIsSet: {
        en: `The Ad is activated again\nand become available to others`,
        ua: `Оголошення знову активоване\nі буде доступним для інших`
    },
    deleteAdConfirmation: {
        en:
            `This action cannot be undone.\n\n` +
            `If you want to temporarily hide your ad, press 📥\n\n` +
            `Confirm your choice.`,
        ua:
            `Цю дію не можна буде скасувати.\n\n` +
            `Якщо ви хочете тимчасово приховати оголошення, натисніть 📥\n\n` +
            `Підтвердіть видалення.`
    },
    reportAdConfirmation: {
        en:
            `You are going to report offensive content or spam in the Ad.\n` +
            `After confirming this action you will no longer see this Ad. And its author can be blocked, if the ad gets a lot of complaints.`,
        ua:
            `Ви збираєтесь повідомити про образливий вміст або спам в оголошенні.\n` +
            `Після підтердження цієї дії ви більше не будете бачити це оголошення. А його автор може бути заблокований, якщо оголошення набере багато скарг.`
    }
};
