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
            required: true
        }
    },
    searchRadius: {
        type: Number,
        require: true
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
