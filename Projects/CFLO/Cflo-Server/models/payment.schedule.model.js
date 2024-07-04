const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const PaymentScheduleSchema = new Schema(
    {

        parent:{
            type: Schema.Types.ObjectId,
            refPath:'parentModelName'      
        },


        parentModelName:{
            type:String 
        },  

        

        milestones:[{
            type: Schema.Types.ObjectId,
            ref:'PaymentMilestone' 
        }],

        user:{
            type: Schema.Types.ObjectId,
            ref:'User'       
        },

    },
    {
      timestamps: true
    }
)

const PaymentSchedule = model('PaymentSchedule', PaymentScheduleSchema);

module.exports = PaymentSchedule