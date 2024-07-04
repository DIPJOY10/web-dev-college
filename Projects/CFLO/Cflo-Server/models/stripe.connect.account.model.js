const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const StripeConnectAccountSchema = new Schema(
    {    
        stripeId:{
            type: String
        },

        email:{
            type: String 
        },

        name:{
            type: String  
        },

        address: {
          line1: String,
          postal_code: String,
          city: String,
          state: String,
          country: String,
        },

        user:{
          type:Schema.Types.ObjectId,
          ref: 'User'
        }       

    }
)

const StripeConnectAccount = model('StripeConnectAccount', StripeConnectAccountSchema);

module.exports = StripeConnectAccount;