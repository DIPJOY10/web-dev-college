const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const QuestionSchema = new Schema(
    {
        form: {
            type: Schema.Types.ObjectId,
            ref: "Form",
        },
        links: [
            {
                title: {type: String, default: ""},
                link: {type: String, default: ""},
            },
        ],

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        open: {type: Boolean, default: false},
        questionText: String,
        questionImage: {type: String, default: ""},
        options: [
            {
                type: Schema.Types.ObjectId,
                ref: "FormOption",
            },
        ],
        optionCols: [
            {
                type: Schema.Types.ObjectId,
                ref: "FormOption",
            },
        ],
        lowerbound:{
            type:Number,
            default: 1,
        },
        upperbound:{
            type:Number,
            default: 5,
        },
        type: {
            type: String,
            enum: ["Multiple Choice",'Dropdown', "Boolean", "Short Answer", "Long Answer",'File Upload',"Date", "Time", 'Linear Scale', 'Multiple Choice Grid', 'Checkbox Grid'  ],
        },
    },
    {
        timestamps: true,
    }
);

const Question = model("Question", QuestionSchema);

module.exports = Question;
