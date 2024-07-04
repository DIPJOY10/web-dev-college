const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const JournalStepSchema = new Schema(
    {

        billListEnabled:{
            type: Boolean,
            default: false, 
        }, 

        billListdebit:{
            type: Boolean,
            default: true, 
        },


        debit:[{
                account:{
                    type: Schema.Types.ObjectId,
                    ref: 'ChartAccount'
                },
                split:{
                    type:Number,
                    default:0
                }
        }],
        

        credit:[{
                account:{
                    type: Schema.Types.ObjectId,
                    ref: 'ChartAccount'
                },
                split:{
                    type:Number,
                    default:0
                }
        }], 
        
        rule:{
            type: Schema.Types.ObjectId,
            ref: 'JournalRule'  
        }
    },
    {
        timestamps: true,
    }
);

const JournalStep = model("JournalStep", JournalStepSchema);

module.exports = JournalStep;
