const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const nameValidaterRegex = /^[a-zA-Z0-9_]+$/;

const CommunitySchema = new Schema({
    displayName: {
        type: String,
        default: "",
        validate: {
            validator: val => val.length >= 3 && val.length <= 31 && nameValidaterRegex.test(val),
            message:
                "Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.",
        },
        unique: true,
    },
    displayPicture: {
        type: Schema.Types.ObjectId,
        ref: "File",
    },
    cover: {
        type: Schema.Types.ObjectId,
        ref: "File",
    },
    description: {
        type: String,
        default: "",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    userProfile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    moderators: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        validate: val => val.length > 0,
    },
    communityType: {
        type: String,
        enum: ["private", "public", "restricted"],
        default: "public",
    },
    joinCount: {
        type: Number,
        default: 0,
    },
});

const Community = model("Community", CommunitySchema);

module.exports = Community;
