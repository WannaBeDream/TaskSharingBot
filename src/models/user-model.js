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
    searchRadius: {
        type: Number,
        default: 0
    },
    lang: {
        type: String,
        required: true
    },
    appStateId: {
        type: String,
        require: true
    },
    appStateData: {
        type: Object
    }
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('users', UserSchema);
