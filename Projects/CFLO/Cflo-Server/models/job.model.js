const mongoose = require('mongoose');
const pointSchema = require('./location.point.model')
const { Schema, model } = mongoose;

const JobSchema = new Schema(
    {

        owner: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },

        numApps: {
            type: Number,
            default: 0
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },

        type: {
            type: String,
            enum: ['Project', 'Organization'],
            default: 'Project'
        },

        project: {
            type: Schema.Types.ObjectId,
            ref: 'Project'
        },

        organization: {
            type: Schema.Types.ObjectId,
            ref: 'Organization'
        },

        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        }],

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },


        title: {
            type: String,
            default: ''
        },

        description: {
            type: String,
            default: ''
        },

        docs: [{
            type: Schema.Types.ObjectId,
            ref: 'Doc'
        }],

        folders: [{
            type: Schema.Types.ObjectId,
            ref: 'DocFolder'
        }],

        payType: {
            type: String,
            enum: ['Fixed', 'Negotiable', 'Performance based', 'Hourly']
        },

        fixed: {
            type: Number
        },

        negoMin: {
            type: Number
        },

        negoMax: {
            type: Number
        },

        minAssured: {
            type: Number
        },

        incentive: {
            type: Number
        },

        hourly: {
            type: Number
        },


        startDate: {
            type: Date,
            default: Date.now
        },

        location: {
            name: String,
            location: {
                type: pointSchema,
                index: '2dsphere' // Create a special 2dsphere index on `City.location`
            }
        },

        remote: {
            type: Boolean,
            default: false
        },


        categories: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],


        whoCanApply: {
            type: String,
            default: ''
        },

        experience: {
            type: Number
        },


        projectProgress: {
            type: String,
            enum: ['Just Starting', 'I have plans/drawings', 'In progress']
        },


        propertyTypes: [{
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

        template: {
            type: Schema.Types.ObjectId,
            ref: 'IssueTemplate'
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


const Job = model('Job', JobSchema);

module.exports = Job;