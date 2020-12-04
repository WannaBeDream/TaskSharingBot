module.exports = {
    ifEmptyArrayMessage: {
        en: `No Ads are found`,
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
        en: `\uD83D\uDC49link to the author`,
        ua: `\uD83D\uDC49посилання на автора`
    },
    deleted: {
        en: `Advertisement was deleted !!!`,
        ua: `Оголошення було видалене !!!`
    },
    deletedSpam: {
        en: `Advertisement was deleted, SPAM !!!`,
        ua: `Оголошення було видалене через підозру на спам !!!`
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
            `This action will delete ad permanently.` +
            `If you want to keep the Ad for future and just to temporarily exclude it being visible to others, use Deactivate option.\n` +
            `Please confirm that You are going to delete ad permanently.`,
        ua:
            `Ця дія видалить оголошення назавжди.\n` +
            `Якщо ви хочете зберегти оголошення на майбутнє і просто тимчасово відключити його видимість для інших, використовуйте опцію Деактивувати.\n` +
            `Підтвердіть, що Ви збираєтесь остаточно видалити оголошення.`
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
