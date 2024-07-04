const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const WaterfallActionSchema = new Schema(
    {

        amount:{
            type: Number,
            default: 0
        },
        isIncome:{
            type: Boolean,
            default: false
        },
        waterfall: {
            type: Schema.Types.ObjectId,
            ref:'Waterfall'
        },
        src:{
            type: Schema.Types.ObjectId,
            ref: "Profile"
        },
        dest:{
            type: Schema.Types.ObjectId,
            ref: "Profile"
        },
        createdAt:{
            type: Date,
            default: Date.now,  
        },
        transaction:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction'  
        },
        type:{
            type: String,
            enum: ['Manual','Automatic'],
            default: 'Manual'
        }
    }
);

const WaterfallAction = model("WaterfallAction", WaterfallActionSchema);

module.exports = WaterfallAction;
