/* eslint-disable no-useless-escape */
/* eslint-disable prettier/prettier */
const SPECIAL_CHARS = /([_|\*|`|\[])/g;

exports.formatPlainText = (text) => text.replace(SPECIAL_CHARS, '\\$1');

exports.formatBoldText = (text) => `*${text.replace(/\*/g, '*\\**')}*`;

exports.formatItalicText = (text) => `_${text.replace(/_/g, '_\\__')}_`;