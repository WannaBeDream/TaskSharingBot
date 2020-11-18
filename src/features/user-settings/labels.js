module.exports = {
    newUserEnterLocation: {
        en: 'Please specify your location',
        ua: 'Будь ласка, задайте вашу локацію'
    },
    newUserEnterRadius: {
        en: 'Please specify the radius of searches, km',
        ua: 'Будь ласка, вкажіть радіус пошуків, км'
    },
    existingUserChangeLocation: {
        en: 'Change location\nYour current location is',
        ua: 'Введіть нову локацію\nВаша поточна локація наступна:'
    },
    existingUserChangeRadius: {
        en: (value) => `Your current radius is ${value}\nPlease select new radius, km`,
        ua: (value) => `Ваш поточний радіус пошуку -- ${value}\nБудь ласка, оберіть новий, км`
    },
    userProfileData: {
        en: (name, radius) => `${name}\nRadius of searches: ${radius}\nCurrent location`,
        ua: (name, radius) => `${name}\nРадіус пошуку оголошень: ${radius}\nПоточна локація`
    },
    language: {
        en: 'English',
        ua: 'Українська'
    },
    locationNotSet: {
        en: "Geolocation isn't set in your message",
        ua: 'Геолокація не встановлена у вашому повідомлені'
    },
    incorrectRadius: {
        en: 'You sent incorrect Radius\nIt must be number from [1..50] range',
        ua: 'Ви надіслали некоректний радіус\nЦе має бути натуральне число у інтервалі [1..50]'
    }
};
