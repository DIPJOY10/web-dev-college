const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const pollSchema = new Schema({
    options: {
        type: [String],
        required: true,
        default: [],
    },
    votes: {
        type: Map,
        of: String,
        default: {},
    },
    expireAt: {
        type: Date,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    parent: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: "parentModelName",
    },
    parentModelName: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Poll = model("Poll", pollSchema);

module.exports = Poll;
