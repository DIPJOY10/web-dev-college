const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const SubscriptionSchema = new Schema(
    {    
        
        active:{
            type:Boolean,
            default: false
        },

        created: {
            type:String   
        },

        current_period_end:{
            type:String         
        },

        periodEnd:{
            type: Date,
            default: Date.now  
        },

        user:{
          type:Schema.Types.ObjectId,
          ref: 'User'
        },


        stripePriceId:{
            type:String  
        },
        
        stripeSubscriptionId:{
            type:String           
        },

        stripeCustomerId:{
            type:String           
        },

        stripePaymentIntent:{
            type:String  
        },

        stripeClientSecret:{
            type:String 
        }

    },{
        timestamps:true
    }
)

const Subscription = model('Subscription', SubscriptionSchema);

module.exports = Subscription;