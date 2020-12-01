module.exports = {
    checkMaxMinReg: {
        en: (min, max) =>
            `You entered less then ${min} or more then ${max} charts or symbols.\n` +
            'You may also have invalid characters in your text.\n' +
            'Or you sent a file or sticker.',
        ua: (min, max) =>
            `Ви ввели менше ніж ${min} або більше ніж ${max} символів.\n` +
            'Також, можливо у Вашому тексті були недопустимі символи.\n' +
            'Або ж Ви відправили файл чи стікер.'
    },
    checkMatchWords: {
        en: `Open the keyboard and select the correct value`,
        ua: `Відкрийте клавіатуру та оберіть коректне значення`
    }
};
