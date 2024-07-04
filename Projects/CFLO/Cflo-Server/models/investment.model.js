const mongoose = require('mongoose');
const pointSchema = require('./location.point.model')
const { Schema, model } = mongoose;

const InvestmentSchema = new Schema(
    {

        owner: {
            type: Schema.Types.ObjectId,
            refPath: 'ownerModelName'
        },

        ownerModelName: {
            type: String
        },

        title: {
            type: String,
            default: ''
        },

        description: {
            type: String,
            default: ''
        },


        activity: {
            type: String,
            default: 'Remodeling'
        },



        header: {
            requirement: {
                type: Number,
                default: 0
            },

            currency: {
                type: String,
                default: 'usd'
            },
            size: {
                type: Number,
                default: 0
            },
            irr: {
                type: Number,
                default: 0
            },
            hold: {
                type: String,
            },
            minTicket: {
                type: Number,
                default: 0
            }
        },

        location: {
            name: String,
            location: {
                type: pointSchema,
                index: '2dsphere' // Create a special 2dsphere index on `City.location`
            }
        },

        propertyTypes: [{
            type: String,
        }],

        area: {
            type: String
        },

        roles: [{
            type: Schema.Types.ObjectId,
            ref: 'RoleMap'
        }],

        schedule: {
            type: Schema.Types.ObjectId,
            ref: 'PaymentSchedule'
        },

        coverImages: [{
            type: Schema.Types.ObjectId,
            ref: 'File'
        }],

        rentComps: [{
            name: {
                type: String,
                default: ''
            },
            address: {
                type: String,
                default: ''
            },
            units: {
                type: Number,
                default: 0
            },
            unitRent: {
                type: Number,
                default: 0
            },
            rsf: {
                type: Number,
                default: 0
            }
        }],

        saleComps: [{
            name: {
                type: String,
                default: ''
            },
            address: {
                type: String,
                default: ''
            },
            dateSold: {
                type: Date,
                default: ''
            },

            salePrice: {
                type: Number,
                default: 0
            },

            units: {
                type: Number,
                default: 1
            },


            unitSalePrice: {
                type: Number,
                default: 0
            },

            totalArea: {
                type: Number,
                default: 0
            },


        }],


        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },

        // team:{
        //   type: Schema.Types.ObjectId,
        //   ref: 'Team'
        // },

        // teams:[{
        //     type: Schema.Types.ObjectId,
        //     ref: 'Team'
        // }],

        assigned: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        }],



        address: {
            line1: String,
            postal_code: String,
            city: String,
            state: String,
            country: String,
        },

        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],

        // square feet

        area: {
            type: String
        },


        files: [{
            type: Schema.Types.ObjectId,
            ref: 'File'
        }],

        docs: [{
            type: Schema.Types.ObjectId,
            ref: 'Doc'
        }],

        folders: [{
            type: Schema.Types.ObjectId,
            ref: 'DocFolder'
        }],

        status: {
            type: String,
            enum: ['Incomplete', 'Review Pending', 'Rejected', 'Active', 'Closed'],
            default: 'Incomplete'
        },

        published: {
            type: Boolean,
            default: false
        },

        publishedAt: {
            type: Date,
            default: Date.now
        },

        numApps: {
            type: Number,
            default: 0
        },

        numComments: {
            type: Number
        },
        subject: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },
        subjectType: {
            type: String
        }


    },
    {
        timestamps: true
    }
);


const Investment = model('Investment', InvestmentSchema);

module.exports = Investment;