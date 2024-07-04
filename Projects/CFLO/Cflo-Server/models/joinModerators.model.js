const mongoose = require("mongoose");

const joinModeratorSchema = new mongoose.Schema({
    community: {
        type: mongoose.Types.ObjectId,
        ref: "Community",
    },
    communityProfile: {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    profile: {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
    },
    invitedProfile: {
        type: mongoose.Types.ObjectId,
        ref: "Profile",
    },
    status: {
        type: String,
        enum: ["new", "progress", "accepted", "rejected"],
        default: "new",
    },
    message: {
        type: String,
        default: "Hi! I would like to join your community",
    },
});

joinModeratorSchema.index({invitedProfile: 1, communityProfile: 1}, {unique: true});

const Join = mongoose.model("JoinModerators", joinModeratorSchema);
module.exports = Join;
