const { AdvertModel } = require('../models');

const deleteAd = async (id) => {
    try {
        await AdvertModel.deleteOne({ _id: id });
    } catch (e) {
        throw new Error('Unable delete advertisement');
    }
};

module.exports = { deleteAd };
