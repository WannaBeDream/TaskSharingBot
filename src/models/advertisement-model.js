const mongoose = require('mongoose');
const {
    titleLength,
    descriptionLength,
    remunerationLength
    // regExpForAdv
} = require('../constants/ad-values');

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
            maxlength: titleLength.max,
            minLength: titleLength.min
        },
        description: {
            type: String,
            default: '',
            maxlength: descriptionLength.max,
            minLength: descriptionLength.min
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
            maxlength: remunerationLength.max,
            minLength: remunerationLength.min
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
