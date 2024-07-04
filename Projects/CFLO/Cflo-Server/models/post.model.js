const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const PostSchema = new Schema({
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
    poll: {
        type: Schema.Types.ObjectId,
        ref: "Poll",
    },

    docs: [
        {
            type: Schema.Types.ObjectId,
            ref: "Doc",
        },
    ],

    folders: [
        {
            type: Schema.Types.ObjectId,
            ref: "DocFolder",
        },
    ],

    commentCount: {
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    topComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    channels: [
        //community profiles in which post is visible
        {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    ],
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    published: {
        type: Boolean,
        default: false,
    },
    edited: {
        type: Boolean,
        default: false,
    },
});

const Post = model("Post", PostSchema);

module.exports = Post;
