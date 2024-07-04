const mongoose = require("mongoose");

const {Schema} = mongoose;

const rentalPolicySchema = new mongoose.Schema({
    // team._id
    projectTeamId: {
        type: Schema.Types.ObjectId,
        ref: "Team",
    },
    shareTickets: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
    },

    shareTicketsWithRole: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "AccessRole",
            },
        ],
    },

    shareDocs: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
    },

    shareDocsWithRole: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "AccessRole",
            },
        ],
    },

    chat: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
    },

    chatWithRole: {
        type: [
            {
                type: Schema.Types.ObjectId,
                ref: "AccessRole",
            },
        ],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const RentalPolicy = mongoose.model("RentalPolicy", rentalPolicySchema);

module.exports = RentalPolicy;
