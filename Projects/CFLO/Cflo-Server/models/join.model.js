const mongoose = require("mongoose");

const joinSchema = new mongoose.Schema(
    {
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
        status: {
            //whether or not private community allowed user to join the community or not
            type: String,
            enum: ["new", "progress", "accepted", "rejected"],
            default: "new",
        },
        message: String,
    },
    {
        timestamps: true,
    }
);

joinSchema.index({profile: 1, communityProfile: 1}, {unique: true});

const Join = mongoose.model("Join", joinSchema);
module.exports = Join;
