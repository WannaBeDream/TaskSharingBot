const { AdvertModel } = require('../../models');

// ! TODO: findByIdAndDelete
const deleteAd = async (id) => {
    try {
        return AdvertModel.findOneAndDelete({ _id: id });
    } catch (e) {
        throw new Error('Unable delete advertisement');
    }
};

module.exports = { deleteAd };
