const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const InvestmentShareSchema = new Schema(
    {
        account: {
            type: Schema.Types.ObjectId,
            ref: "Profile", 
        },
        amount: {
            type: Number,
            default: 0
        },
        role: {
            type: String,
            enum: ['LP','GP'],
        },
        waterfall: {
            type: Schema.Types.ObjectId,
            ref: "Waterfall", 
        },
    },
    {
        timestamps: true,
    }
);

const InvestmentShare = model("InvestmentShare", InvestmentShareSchema);

module.exports = InvestmentShare;
