const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const FormOptionSchema = new Schema(
    {
        question: {
            type: Schema.Types.ObjectId,
            ref: "Question",
        },
        optionText: String,
        optionImage: {
            type: String,
            default: ""
        },
    }
);

const FormOption = model("FormOption", FormOptionSchema);

module.exports = FormOption;