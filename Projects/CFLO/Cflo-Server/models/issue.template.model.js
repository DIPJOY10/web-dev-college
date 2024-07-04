var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const IssueTemplateSchema = new mongoose.Schema(
    {
        issueCounter: {
            type: Number,
            default: 1,
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

        status: {
            type: String,
        },

        pipeline: [
            {
                type: Schema.Types.ObjectId,
                ref: "StatusItem",
            },
        ],

        startState: {
            type: Schema.Types.ObjectId,
            ref: "StatusItem",
        },

        finalStates: [
            {
                type: Schema.Types.ObjectId,
                ref: "StatusItem",
            },
        ],

        labels: [
            {
                type: String,
            },
        ],

        managers: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        priority: {
            type: Number,
            default: 3,
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        shared: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        createdAt: {
            type: Date,
            default: Date.now,
        },
        type: {
            type: String,
        },
        platform: {
            type: Boolean,
            default: false,
        },
        form: {
            type: Schema.Types.ObjectId,
            ref: "Form",
        },
    },
    {
        timestamps: true,
    }
);

var IssueTemplate = mongoose.model("IssueTemplate", IssueTemplateSchema);

module.exports = IssueTemplate;
