const { AdvertModel } = require('../../models');

const deleteAd = async (id) => {
    try {
        return AdvertModel.findByIdAndDelete({ _id: id });
    } catch (e) {
        throw new Error('Unable delete advertisement');
    }
};

module.exports = { deleteAd };
