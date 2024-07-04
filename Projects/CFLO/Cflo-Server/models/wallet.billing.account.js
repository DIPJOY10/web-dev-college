var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const BillingAccountSchema = new mongoose.Schema({


    name:{
        type: String,
        default:''
    },

    email:{
        type: String,
        default:''
    },

    phone:{
        type: String,
        default:''
    },

    address: {
        line1: { type: String, default:''},
        postal_code: { type: String, default:''},
        city: { type: String, default:''},
        state: { type: String, default:''},
        country: { type: String, default:''},
    },

    profile:{
        type: Schema.Types.ObjectId,
        ref: 'Profile'  
    },

    addedBy:{
        type: Schema.Types.ObjectId,
        ref: 'Profile'  
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },

    created:{
        type: Date,
        default: Date.now   
    },

    // attach payment provider specific code

    stripeCustomerId:{
        type: String,
    },

    stripeBankAccount:{
        type: String,
    },

    stripeBankAccounts:[{
        plaidToken:{
            type: String, 
        },
        stripeBankAccount:{
            type: String, 
        },
    }],

    providers:[{
        type: String, default:''
    }],

    plaidAuthDone:{
        type: Boolean,
        default:false 
    },

    plaidAccessToken:{
        type: String,
    },

    plaidItemId:{
        type: String,
    },

    plaidBankAccountToken:{
        type: String,       
    },



})

var BillingAccount = mongoose.model('BillingAccount', BillingAccountSchema);

module.exports = BillingAccount;