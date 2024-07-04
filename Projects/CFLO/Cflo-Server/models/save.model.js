const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const saveModel = new Schema({
    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
        require: [true, "Provide parent"],
    },
    parentModelName: {
        type: String,
        required: [true, "Provide model of parent"],
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        require: [true, "Provide profile"],
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: [true, "Provide user"],
    },
});

const Save = model("Save", saveModel);

module.exports = Save;
