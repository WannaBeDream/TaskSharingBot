const { UserModel } = require('../models');

const updateUserState = async (telegramId, data) => {
    try {
        return await UserModel.updateOne({ _id: telegramId }, data);
    } catch (e) {
        throw new Error('Unable update user');
    }
};

module.exports = { updateUserState };
