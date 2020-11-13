const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    telegramId: {
        type: Number,
        require: true,
        unique: true
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [Number],
        require: true,
        unique: false
    },
    searchRadius: {
        type: Number,
        require: true,
        unique: false
    },
    savedAdvertisements: {
        ref: 'advertisements',
        type: [mongoose.Schema.Types.ObjectId],
        require: false,
        unique: false
    }
});

module.exports = mongoose.model('User', UserSchema);
