const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const StripeCustomerSchema = new Schema(
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

const StripeCustomer = model('StripeCustomer', StripeCustomerSchema);

module.exports = StripeCustomer;