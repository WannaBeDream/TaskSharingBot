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
            default: ''
        },
        description: {
            type: String,
            default: ''
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
        category: {
            type: String,
            default: ''
        },
        renumeration: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: false
        },
        spam: {
            type: [Number],
            default: []
        }
    },
    { timestamps: true }
);

AdvertisementSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('advertisements', AdvertisementSchema);
