const mongoose = require('mongoose');
const {
    longSmallTitleValue,
    longSmallDescriptionValue,
    longSmallRenumerationValue
    // regExpForAdv
} = require('../validators/user-input-data/constants');

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
            //     // eslint-disable-next-line security/detect-non-literal-regexp
            //     new RegExp(regExpForAdv.app),
            //     "{PATH} '{VALUE}' is not valid. Use only letters, numbers"
            // ],
            maxlength: longSmallTitleValue.max,
            minLength: longSmallTitleValue.min
        },
        description: {
            type: String,
            default: '',
            maxlength: longSmallDescriptionValue.max,
            minLength: longSmallDescriptionValue.min
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
            maxlength: longSmallRenumerationValue.max,
            minLength: longSmallRenumerationValue.min
        },
        isActive: {
            type: Boolean,
            default: false
        },
        spam: {
            type: [Number],
            default: []
        },
        usersSaved: {
            type: [Number],
            default: []
        }
    },
    { timestamps: true }
);

AdvertisementSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('advertisements', AdvertisementSchema);
