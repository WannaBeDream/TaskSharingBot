/* eslint-disable camelcase */
exports.answerCallbackQuery = (queryId, alert) => ({
    method: 'answerCallbackQuery',
    body: {
        callback_query_id: queryId,
        ...(alert ? { text: alert, show_alert: true } : {})
    }
});

exports.buildInlineButton = (key, command, lang) => ({
    text: command.title[`${lang}`],
    callback_data: JSON.stringify({ key, cmd: command.id })
});

exports.deleteChatMessage = (chatData) => [
    exports.answerCallbackQuery(chatData.callbackQueryId),
    { method: 'deleteMessage', body: { chat_id: chatData.chatId, message_id: chatData.messageId } }
];

exports.editChatMessageActions = (chatData, lang, actions, adId, alert) => {
    const inlineButtons = actions.map((cmd) => exports.buildInlineButton(adId, cmd, lang));
    return [
        exports.answerCallbackQuery(chatData.callbackQueryId, alert && alert[`${lang}`]),
        {
            method: 'editMessageReplyMarkup',
            body: {
                chat_id: chatData.chatId,
                message_id: chatData.messageId,
                reply_markup: { inline_keyboard: [inlineButtons] }
            }
        }
    ];
};

function editChatMessageOrCaption(chatData, lang, content, actions, adId, isCaption) {
    const inlineButtons = actions.map((cmd) => exports.buildInlineButton(adId, cmd, lang));
    const localeContent = content != null && typeof content === 'object' ? content[`${lang}`] : content;
    return [
        exports.answerCallbackQuery(chatData.callbackQueryId),
        {
            ...(isCaption ? { method: 'editMessageCaption' } : { method: 'editMessageText' }),
            body: {
                chat_id: chatData.chatId,
                message_id: chatData.messageId,
                ...(isCaption ? { caption: localeContent } : { text: localeContent }),
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [inlineButtons] }
            }
        }
    ];
}

exports.editAdContent = (chatData, lang, content, actions, ad) => {
    return editChatMessageOrCaption(chatData, lang, content, actions, ad._id, !!ad.imgId);
};

exports.sendPhoto = (fileId, caption, keyboard, isKeyboardInline) => ({
    method: 'sendPhoto',
    body: {
        photo: fileId,
        caption,
        parse_mode: 'Markdown',
        reply_markup: {
            ...(isKeyboardInline ? { inline_keyboard: keyboard } : { keyboard }),
            resize_keyboard: true
        }
    }
});
