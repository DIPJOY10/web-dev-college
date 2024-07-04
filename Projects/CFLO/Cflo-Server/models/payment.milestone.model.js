const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const PaymentMilestoneSchema = new Schema(
    {

        amount:{
            type:Number,
            default:0
        },
        percentage:{
            type:Number,
            default:0
        },
        name:{
            type:String,
        },
        status: {
            type: String,
            enum: ["Planned", "In Progress", "Completed"],
            default: "Planned"
        },
        dependency:[{
            type: Schema.Types.ObjectId,
            ref:'PaymentMilestone'      
        }],
        expectedStart:{
            type: Date,
            default: Date.now  
        },
        expectedFinish:{
            type: Date,
            default: Date.now   
        },
        schedule:{
            type: Schema.Types.ObjectId,
            ref:'PaymentSchedule' 
        }

    },
    {
      timestamps: true
    }
)

const PaymentMilestone = model('PaymentMilestone', PaymentMilestoneSchema);

module.exports = PaymentMilestone