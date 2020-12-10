module.exports = {
    newUserEnterLocation: {
        en:
            'You are required to specify your location.\n' +
            `The Bot doesn't reveal your location to others. ` +
            'This location is only used to show the ads of users who are the nearest to you. It can be any place in your area.\n' +
            `Press 📎 to send location at manually or to adjust the location automatically, press the button.`,
        ua:
            `Ви маєте задати вашу локацію.\n` +
            `Бот не показує це місцезнаходження нікому. Воно використовується тільки, щоб показати оголошення людей, які є найближчими до вас. ` +
            `Можна обрати будь-яке місце у вашій області.\n` +
            `Щоб встановити локацію вручну, натисніть 📎 аби налаштувати локацію в автоматичному режимі натисніть кнопку.`
    },
    newUserEnterRadius: {
        en: 'Please specify also the radius of searches, km',
        ua: 'Будь ласка, вкажіть також радіус пошуків, км'
    },
    existingUserChangeLocation: {
        en:
            `Warning! After the location change the distribution area of your ads and recommendations will be changed.\n` +
            `Your current location is:`,
        ua:
            `Увага! Після зміни локації область поширення Ваших оголошень та рекомендацій зміниться.\n` +
            `Ваша поточна локація наступна:`
    },
    existingUserChangeRadius: {
        en: (value) => `Your current search radius is ${value} km\nPlease select or enter a new one:`,
        ua: (value) => `Ваш поточний радіус пошуку ${value} км\nБудь ласка, оберіть або введіть новий:`
    },
    existingUserSetRadius: {
        en: (radius) => radius.map((item) => `${item} km`),
        ua: (radius) => radius.map((item) => `${item} км`)
    },
    userProfileData: {
        en: (name, radius) => `${name}\nRadius of searches: ${radius} km\nCurrent location:`,
        ua: (name, radius) => `${name}\nРадіус пошуку оголошень: ${radius} км\nПоточна локація:`
    },
    language: {
        en: 'English 🇬🇧',
        ua: 'Українська 🇺🇦'
    },
    setLanguage: {
        en: 'Choose a new language 🌍',
        ua: 'Оберіть нову мову 🌍'
    },
    choose: {
        en: 'Choose ⚙️',
        ua: 'Обирайте ⚙️'
    },
    locationNotSet: {
        en: `Geolocation isn't set in your message`,
        ua: 'Геолокація не встановлена у вашому повідомлені'
    },
    incorrectRadius: {
        en: 'You sent incorrect Radius\nIt must be integer number from [1..50] range',
        ua: 'Ви надіслали некоректний радіус\nЦе має бути натуральне число у інтервалі [1..50]'
    },
    updatedParamRadius: {
        en: 'radius',
        ua: 'Радіус'
    },
    updatedParamLocation: {
        en: 'location',
        ua: 'Локацію'
    },
    updatedParamLang: {
        en: 'language',
        ua: 'Мову'
    },
    locationAutoSend: {
        en: 'Specify a location',
        ua: 'Вказати місце розташування'
    }
};
