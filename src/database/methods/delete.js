const { AdvertModel } = require('../../models');
const { logger } = require('../../helpers');

const deleteAd = async (id) => {
    try {
        await AdvertModel.deleteOne({ _id: id });
    } catch (e) {
        logger.error(e);
        throw new Error('Unable delete advertisement');
    }
};

module.exports = { deleteAd };
