var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const IssueSchema = new mongoose.Schema(
    {
        issueId: {
            type: Number,
        },

        title: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        addnFields: [
            {
                name: {
                    type: String,
                    default: "",
                },
                values: [
                    {
                        type: String,
                        default: "",
                    },
                ],
            },
        ],

        parent: {
            type: Schema.Types.ObjectId,
            refPath: "parentModelName",
        },

        parentModelName: {
            type: String,
        },

        checklist: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],

        createdAt: {
            type: Date,
            default: Date.now,
        },

        startDate: {
            type: Date,
            default: Date.now,
        },

        finishDate: {
            type: Date,
            default: Date.now,
        },

        projectedDuration: {
            years: Number,
            months: Number,
            days: Number,
            hours: Number,
            minutes: Number,
        },

        actualStart: {
            type: Date,
            default: Date.now,
        },
        actualFinish: {
            type: Date,
            default: Date.now,
        },

        /**
         * Status and priority related fields
         */

        tags: [
            {
                type: String,
            },
        ],

        isPrivate: {
            type: Boolean,
            default: false,
        },

        closed: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
        },

        template: {
            type: Schema.Types.ObjectId,
            ref: "IssueTemplate",
        },

        formResponses: [{
            type: Schema.Types.ObjectId,
            ref: 'FormResponse'
        }],

        priority: {
            type: Number,
            default: 3,
        },

        /**
         * Powerful Attachments
         */

        calendarEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: "CalendarEvent",
            },
        ],

        transactions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Transaction",
            },
        ],

        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        /**
         * Creator related fields
         */

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        assigned: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        shared: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        parentIssue: {
            type: Schema.Types.ObjectId,
            ref: "Issue",
        },

        /**
         * Property and rental unit
         */

        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        unit: {
            type: Schema.Types.ObjectId,
            ref: "RentalUnit",
        },
        activeUserId:{
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        activeUserProfile:{
            type: Schema.Types.ObjectId,
            ref: "Profile",
        }
    },
    {
        timestamps: true,
    }
);

const Issue = mongoose.model("Issue", IssueSchema);

module.exports = Issue;
