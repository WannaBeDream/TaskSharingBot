const mongoose = require('mongoose');
const {
    theLongestTitleValue,
    theLongestDescriptionValue,
    theLongestRenumerationValue
} = require('../helpers/validators/constants');

const AdvertisementSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.Number,
            ref: 'users',
            require: true
        },
        title: {
            type: String,
            default: '',
            // match: [
            //     // eslint-disable-next-line sonarjs/no-duplicate-string
            //     new RegExp('[/^_./gim]'),
            //     "{PATH} '{VALUE}' is not valid. Use only letters, numbers"
            // ],
            maxlength: theLongestTitleValue
        },
        description: {
            type: String,
            default: '',
            maxlength: theLongestDescriptionValue
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
        imgId: {
            type: String,
            default: ''
        },
        renumeration: {
            type: String,
            default: '',
            maxlength: theLongestRenumerationValue
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
