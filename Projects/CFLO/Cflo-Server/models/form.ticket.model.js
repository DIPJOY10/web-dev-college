const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const FormTicketSchema = new Schema(
    {
        form: {
            type: Schema.Types.ObjectId,
            ref: 'Form'
        },
       
        answers:[{
            type: Schema.Types.ObjectId,
            ref: "Response"
        }],


        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }


        // open: { type: Boolean, default: false },
        // questionText: String,
        // questionImage: { type: String, default: "" },
        // options: [{
        //     optionText: String,
        //     optionImage: { type: String, default: "" },
        // }],
        // type: {
        //     type: String,
        //     enum: ["Multiple Choice", 'Boolean', "Short Answer", "Long Answer"]
        // }
    },
    {
        timestamps: true,
    }
);

const FormTicket = model("FormTicket", FormTicketSchema);

module.exports = FormTicket;
