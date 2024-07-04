const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const PaymentPlanSchema = new Schema(
    {

        parent:{
            type: Schema.Types.ObjectId,
            refPath:'parentModelName'      
        },


        parentModelName:{
            type:String 
        },  

        schedule:[{
            time:{
                type: Date,
            },
            invoice:{
                type: Schema.Types.ObjectId,
                ref:'Invoice'        
            }
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

const PaymentPlan = model('PaymentPlan', PaymentPlanSchema);

module.exports = PaymentPlan