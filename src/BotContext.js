exports.createImmutableBotContext = (user, inputData, chatData) => {
    let language = user.lang;
    return Object.freeze({
        user: Object.freeze({ id: user.id, name: user.name, location: user.location, searchRadius: user.searchRadius }),
        inputData: Object.freeze(inputData),
        chatData: Object.freeze(chatData),
        userStateDataHolder: { data: user.appStateData },
        tmpStateDataHolder: { data: null },
        get lang() {
            return language;
        },
        set lang(lang) {
            language = lang;
        }
    });
};
