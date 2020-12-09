module.exports = {
    newUserGreeting: {
        en: (name) => `Hello ${name}!`,
        ua: (name) => `Привіт, ${name}!`
    },
    existingUserGreeting: {
        en: (name) => `Welcome back ${name}`,
        ua: (name) => `З поверненням, ${name}`
    },
    userHome: {
        en: `Main menu 🏠`,
        ua: `Головне меню 🏠`
    },
    updatedMessage: {
        en: (param) => `Your ${param} was successfully updated.`,
        ua: (param) => `${param} успішно змінено.`
    }
};
