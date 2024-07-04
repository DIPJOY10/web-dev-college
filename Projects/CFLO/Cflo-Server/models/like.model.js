const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const likeSchema = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
    },
    parentModelName: {
        type: String,
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});

likeSchema.index({parent: 1, profile: 1}, {unique: true});

const Like = model("Like", likeSchema);

module.exports = Like;
