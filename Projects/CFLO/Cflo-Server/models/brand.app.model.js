const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const BrandAppSchema = new Schema(
    {

        complete: {
            type: Boolean,
            default: false
        },

        temp: {
            type: Boolean,
            default: true
        },

        contactName: {
            type: String,
            default: ''
        },

        contactEmail: {
            type: String,
            default: ''
        },

        name: {
            type: String,
            default: ''
        },

        description: {
            type: String,
            default: ''
        },

        displayPicture: {
            type: Schema.Types.ObjectId,
            ref: 'File'
        },

        transaction: {
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        },

        amount: {
            type: Number,
            default: 200
        },

        baseAmount: {
            type: Number,
            default: 200
        },

        coupon: {
            type: Schema.Types.ObjectId,
            ref: 'Coupon'
        },

        paid: {
            type: Boolean,
            default: false
        },

        basicInfo: {
            type: Boolean,
            default: false
        },

        type: {
            type: String,
            default: 'TenantManagement',
            enum: ['Construction', 'BIM', 'TenantManagement']
        },

        publicVisibility: {
            type: Boolean,
            default: false
        },

        androidApp: {
            uri: {
                type: String
            },

        },

        iosApp: {
            uri: {
                type: String
            },
        },

        access: [{
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        }],

        accessRole: [{
            type: Schema.Types.ObjectId,
            ref: 'AccessRole'
        }],

        ownerShip: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        timestamps: true
    }
);

const BrandApp = model('BrandApp', BrandAppSchema);

module.exports = BrandApp;
