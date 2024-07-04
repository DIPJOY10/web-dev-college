const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const BlogSchema = new Schema(
    {

        title: {
            type: String,
            default: "",
        },

        DPBlog: {
            type: Schema.Types.ObjectId,
            ref: "File",
        },

        desc: {
            type: String,
        },

        categories: [{
            type: Schema.Types.ObjectId,
            ref: "Category",
        }],

        isPinUp: {
            type: Boolean,
            default: false,
        },

        paras: [{
            type: Schema.Types.ObjectId,
            ref: "Doc",
        }],

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        isPublic: {
            type: Boolean,
            default: false
        },

        postedAt: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
