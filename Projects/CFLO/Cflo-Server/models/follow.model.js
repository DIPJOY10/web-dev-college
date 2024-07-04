const mongoose = require("mongoose");

const {Schema, model} = mongoose;

//user follows profile
const FollowSchema = new Schema({
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
});

FollowSchema.index({userProfile: 1, profile: 1}, {unique: true});

const Follow = model("follows", FollowSchema);

module.exports = Follow;
