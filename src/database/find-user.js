const { UserModel } = require('../models');

const findUser = async (telegramId) => {
    try {
        return await UserModel.findById(telegramId);
    } catch (e) {
        throw new Error('Unable find user');
    }
};

module.exports = { findUser };
