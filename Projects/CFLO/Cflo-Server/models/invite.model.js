const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const InviteSchema = new Schema(
    {
        type: {
            type: String,
            enum: ["Platform", "Email"],
            default: "Platform",
        },

        inviteId: {
            type: String,
        },

        email: {
            type: String,
        },

        text: {
            type: String,
        },

        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        teamProfile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        teamType: {
            type: String,
            enum: ["Organization", "Project"],
            default: "Organization",
        },

        status: {
            //Accepted or Ignored
            type: Boolean,
            default: false,
        },

        seen: {
            type: Boolean,
            default: false,
        },

        deleted: {
            //Rejected
            type: Boolean,
            default: false,
        },

        //One Who got invited
        invitee: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        role: {
            type: String,
            enum: ["Owner", "Admin", "Editor", "Viewer"],
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        invitedById: {
            type: Schema.Types.ObjectId,
            refPath: "Profile",
        },
    },
    {
        timestamps: true,
    }
);

const Invite = model("Invite", InviteSchema);

module.exports = Invite;
