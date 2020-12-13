const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    _id: {
        type: Number,
        required: true
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
    lang: {
        type: String
    },
    searchRadius: {
        type: Number,
        default: 0
    },
    state: {
        appStateId: {
            type: String,
            require: true
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
            type: String
        }
    }
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('users', UserSchema);
