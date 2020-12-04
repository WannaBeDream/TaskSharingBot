const { AdvertModel } = require('../../models');
const { logger } = require('../../helpers');

const deleteAd = async (id) => {
    try {
        await AdvertModel.deleteOne({ _id: id });
    } catch (error) {
        logger.error({
            level: 'error',
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable delete advertisement');
    }
};

module.exports = { deleteAd };
