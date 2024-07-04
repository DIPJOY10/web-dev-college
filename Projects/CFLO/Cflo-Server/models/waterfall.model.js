const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const WaterfallSchema = new Schema(
    {

        title: {
            type: String,
            default: "",
        },

        investmentShares:[{
            type: Schema.Types.ObjectId,
            ref: "InvestmentShare", 
        }],

        compounding:{
            period :{
                type: String,
                enum: ["Monthly",'Daily','Quarterly','Yearly'],
                default: 'Yearly'
            },
            rate:{
                type: Number,
                default: 0
            }
        },

        hurdles:[{
            typeAndValues:[{
                type: {
                    type: String,
                    enum: ['IRR','Cash Multiple','TWR'],
                    default: 'IRR'
                },
                value:{
                    type: Number,
                    default: 0
                }

            }],
            rule:{
                type: String,
                enum: ['Greatest', 'Least'],
                default: 'Greatest'
            },
            catchup:{
                type : Boolean,
                default: false
            }
        }],

        actions:[{
            type: Schema.Types.ObjectId,
            ref:'WaterfallAction'
        }],

        notify: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        createdAt: {
            type: Date,
            default: Date.now,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    },
    {
        timestamps: true,
    }
);

const Waterfall = model("Waterfall", WaterfallSchema);

module.exports = Waterfall;
