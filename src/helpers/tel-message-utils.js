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

exports.deleteChatMessage = ({ callback_query_id, chat_id, message_id }) => [
    exports.answerCallbackQuery(callback_query_id),
    { method: 'deleteMessage', body: { chat_id, message_id } }
];

exports.editChatMessageActions = ({ callback_query_id, chat_id, message_id }, lang, actions, adId, alert) => {
    const inlineButtons = actions.map((cmd) => exports.buildInlineButton(adId, cmd, lang));
    return [
        exports.answerCallbackQuery(callback_query_id, alert && alert[`${lang}`]),
        {
            method: 'editMessageReplyMarkup',
            body: { chat_id, message_id, reply_markup: { inline_keyboard: [inlineButtons] } }
        }
    ];
};

function editChatMessageOrCaption(queryId, chat_id, message_id, lang, content, actions, adId, isCaption) {
    const inlineButtons = actions.map((cmd) => exports.buildInlineButton(adId, cmd, lang));
    const localeContent = content != null && typeof content === 'object' ? content[`${lang}`] : content;
    return [
        exports.answerCallbackQuery(queryId),
        {
            ...(isCaption ? { method: 'editMessageCaption' } : { method: 'editMessageText' }),
            body: {
                chat_id,
                message_id,
                ...(isCaption ? { caption: localeContent } : { text: localeContent }),
                parse_mode: 'Markdown',
                reply_markup: { inline_keyboard: [inlineButtons] }
            }
        }
    ];
}

exports.editAdContent = ({ callback_query_id, chat_id, message_id }, lang, content, actions, ad) => {
    return editChatMessageOrCaption(callback_query_id, chat_id, message_id, lang, content, actions, ad._id, !!ad.imgId);
};

exports.sendPhotoWithInlineKeyboard = (fileId, caption, inline_keyboard) => ({
    method: 'sendPhoto',
    body: {
        photo: fileId,
        caption,
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard, resize_keyboard: true }
    }
});

exports.sendPhotoWithKeyboard = (fileId, caption, keyboard) => ({
    method: 'sendPhoto',
    body: {
        photo: fileId,
        caption,
        parse_mode: 'Markdown',
        reply_markup: { keyboard, resize_keyboard: true }
    }
});
