const mongoose = require('mongoose');

const AdvertisementSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.Number,
            ref: 'users',
            require: true
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
            coordinates: {
                type: [Number],
                require: true
            }
        },
        category: {
            type: String,
            require: true,
            unique: false
        },
        remuneration: {
            type: String,
            unique: false
        },
        isActive: {
            type: Boolean,
            require: true,
            unique: false
        }
    },
    { timestamps: true }
);

AdvertisementSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('advertisements', AdvertisementSchema);
