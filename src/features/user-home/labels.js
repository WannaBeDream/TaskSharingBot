module.exports = {
    newUserGreeting: {
        en: (name) => `Hello ${name}!`,
        ua: (name) => `Привіт, ${name}!`
    },
    botRestartUserGreeting: {
        en: (name, radius) =>
            `${name}, you have just restarted the bot.\nYour current settings:\n-- radius of searshes is ${radius}km\n-- location is`,
        ua: (name, radius) =>
            `${name}, ви щойно перестартували бота.\nВаші поточні налаштування:\n-- радіус пошуків оголошень - ${radius}км\n-- локація`
    },
    userHome: {
        en: `🏠 Main menu`,
        ua: `🏠 Головне меню`
    }
};
