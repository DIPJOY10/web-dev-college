const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const ProfileSchema = new Schema(
    {
        model: {
            type: String,
            default: "Profile",
        },

        public: {
            type: Boolean,
            default: false,
        },

        primaryEmail: {
            type: String,
            default: "",
        },

        emails: [
            {
                type: String,
                default: "",
            },
        ],

        verifiedEmails: [
            {
                type: String,
                default: "",
            },
        ],

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        projectExp: [
            {
                type: Schema.Types.ObjectId,
                ref: "ProjectExp",
            }
        ],

        parent: {
            type: Schema.Types.ObjectId,
            refPath: "parentModelName",
        },

        parentModelName: {
            type: String,
        },

        followerCount: {
            type: Number,
            default: 0,
        },

        followingCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Profile = model("Profile", ProfileSchema);

module.exports = Profile;
