const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const CheckoutSchema = new Schema(
    {    
        type:{
            type:String,
            enum:['Platform','Marketplace']
        },

        paid:{
            type:Boolean
        },

        description:{
            type:String,
        },

        provider:{
            type:String,
            enum:['Stripe','Dwolla']         
        },

        stripePaymentIntent:{
            intentId:{
                type:String,
            },

            clientSecret:{
                type:String,
            }
        },


        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'  
        },

    
        parent:{
            type: Schema.Types.ObjectId,
            refPath: 'parentModelName'  
        },

        parentModelName:{
            type: String, 
        },

        amount:{
            type: Number
        },

        amountPaid:{
            type: Number
        },

        currency:{
            type: String,
            default:'usd'
        },

        source:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

        destination:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

        wallets:[{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'       
        }],

        createdAt: {
            type: Date,
            default: Date.now
        }

    }
)

const Checkout = model('Checkout', CheckoutSchema);

module.exports = Checkout;