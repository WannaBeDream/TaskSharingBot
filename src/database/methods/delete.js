const { AdvertModel } = require('../../models');
const { logger } = require('../../helpers');

const deleteAd = async (id) => {
    try {
        await AdvertModel.deleteOne({ _id: id });
    } catch (error) {
        logger.error({
            timestamp: '',
            level: 'error',
            errorIn: 'database/methods/delete.js/deleteAd',
            code: error.code,
            message: error.message,
            stack: error.stack
        });
        throw new Error('Unable delete advertisement');
    }
};

module.exports = { deleteAd };
