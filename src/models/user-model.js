const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true,
        validate: [(str) => validator.isNumeric(`${str}`), "{PATH} '{VALUE}' is not valid"]
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        }
    },
    searchRadius: {
        type: Number,
        default: 0
    },
    appStateId: {
        type: String,
        require: true,
        validate: [validator.isAlpha, "{PATH} '{VALUE}' is not valid"]
    },
    lang: {
        type: String
    },
    adsViewMode: {
        type: String
    },
    adsCategory: {
        type: String
    },
    adsPage: {
        type: Number
    },
    currentUpdateAd: {
        type: String,
        require: false
    }
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('users', UserSchema);
