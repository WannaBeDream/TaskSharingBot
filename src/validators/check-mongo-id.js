const { AdvertModel } = require('../models');

module.exports.verificationDataForCompliance = async (_id) => {
    try {
        await AdvertModel.findById({ _id }, { _id: true });
        return true;
    } catch (e) {
        return false;
    }
};
