module.exports = {
    newUserEnterLocation: {
        en:
            'You are required to specify your location.\n' +
            `The Bot doesn't reveal your location to others. ` +
            'This location is only used to show the ads of users who are the nearest to you. It can be any place in your area.\n' +
            `Press 'Attach' button to send location.`,
        ua:
            `Ви маєте задати вашу локацію.\n` +
            `Бот не показує це місцезнаходження нікому. Воно використовується тільки, щоб показати оголошення людей, які є найближчими до вас. ` +
            `Можна обрати будь-яке місце у вашій області.\n` +
            `Щоб встановити локацію, натисніть 'Скріпку'.`
    },
    newUserEnterRadius: {
        en: 'Please specify also the radius of searches, km',
        ua: 'Будь ласка, вкажіть також радіус пошуків, км'
    },
    existingUserChangeLocation: {
        en:
            `You are about to change the location of area for Ads searches. ` +
            `Note that all your existing Ads will also be associated with new location and be shown for users of another target area.\n` +
            `Your current location is:`,
        ua:
            `Ви намагаєтесь змінити локацію області пошуку оголошеннь. Увага! ` +
            `Усі ваші поточні оголошення також будуть переналаштовані на нову локацію, і їх будуть бачити люди із місцезнаходженням у відповідній області\n.` +
            `Ваша поточна локація наступна:`
    },
    existingUserChangeRadius: {
        en: (value) => `Your current radius of searches is ${value}\nPlease select new radius, km`,
        ua: (value) => `Ваш поточний радіус пошуку -- ${value}\nБудь ласка, оберіть новий, км`
    },
    userProfileData: {
        en: (name, radius) => `${name}\nRadius of searches: ${radius}\nCurrent location:`,
        ua: (name, radius) => `${name}\nРадіус пошуку оголошень: ${radius}\nПоточна локація:`
    },
    language: {
        en: 'English 🇬🇧',
        ua: 'Українська 🇺🇦'
    },
    locationNotSet: {
        en: `Geolocation isn't set in your message`,
        ua: 'Геолокація не встановлена у вашому повідомлені'
    },
    incorrectRadius: {
        en: 'You sent incorrect Radius\nIt must be integer number from [1..50] range',
        ua: 'Ви надіслали некоректний радіус\nЦе має бути натуральне число у інтервалі [1..50]'
    }
};
