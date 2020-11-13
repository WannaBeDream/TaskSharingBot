const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema({
    author: {
        ref: 'users',
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        unique: false
    },
    title: {
        type: String,
        require: true,
        unique: false
    },
    description: {
        type: String,
        require: true,
        unique: false
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
    category: {
        type: String,
        require: true,
        unique: false
    },
    remuneration: {
        type: Number || String || Boolean,
        require: true,
        unique: false
    },
    isActive: {
        type: Boolean,
        require: true,
        unique: false
    }
},
    { timestamps: true });

module.exports = mongoose.model('Advertisement', AdvertisementSchema);
