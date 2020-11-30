module.exports = {
    checkMaxMinReg: {
        en: (min, max) => `You entered less then ${min} or more then ${max} charts or symbols`,
        ua: (min, max) => `Ви ввели менше ніж ${min} або більше ніж ${max} символів.\n
        Можливо у Вашому тексті були недопустимі символи`
    },
    checkMatchWords: {
        en: `Open the keyboard and select the correct value`,
        ua: `Відкрийте клавіатуру та оберіть коректне значення`
    }
};
