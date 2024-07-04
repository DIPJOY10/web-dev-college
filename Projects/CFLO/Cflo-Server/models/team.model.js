const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const TeamSchema = new Schema({
    parentTeam: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },

    ancestors: [
        {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },
    ],

    participants: [
        {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    ],

    permissions: {
        type: Map,
        of: String,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    parent: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "parentModelName",
    },

    parentModelName: {
        type: String,
        required: true,
        enum: ["Project", "Organization"],
    },

    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
    },
});

const Team = model("Team", TeamSchema);

module.exports = Team;
