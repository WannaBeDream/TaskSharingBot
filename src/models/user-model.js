const mongoose = require('mongoose');
const autopopulate = require('mongoose-autopopulate');

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
    searchRadius: {
        type: Number,
        default: 0
    },
    appStateId: {
        type: String,
        require: true
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
    },
    savedAdvertisements: [
        {
            ref: 'advertisements',
            type: [mongoose.Schema.Types.ObjectId],
            autopopulate: true
        }
    ]
});

UserSchema.index({ location: '2dsphere' });
UserSchema.plugin(autopopulate);

module.exports = mongoose.model('users', UserSchema);
