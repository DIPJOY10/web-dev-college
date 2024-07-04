var mongoose = require("mongoose");

var Schema = mongoose.Schema;

/**
 * Comment Schema
 * Comment belongs to Discussion Model Schema
 */

const CommentSchema = new mongoose.Schema(
    {
        text: {
            type: String,
        },
        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        createdAt: {
            type: Date,
            default: Date.now,
        },

        parent: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: "parentModelName",
        },

        parentModelName: {
            type: String,
            required: true,
        },

        profilesTag: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        // user will always be linked to a human

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    },
    {
        timestamps: true,
    }
);

/**
 * Discussion Model Schema
 */

const DiscussionSchema = new mongoose.Schema(
    {
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],

        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        title: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        assigned: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
    },
    {
        timestamps: true,
    }
);

var Comment = mongoose.model("Comment", CommentSchema);
var Discussion = mongoose.model("Discussion", DiscussionSchema);

module.exports = {
    Comment,
    Discussion,
};
