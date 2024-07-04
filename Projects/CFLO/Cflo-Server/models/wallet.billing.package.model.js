const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

/**
 * 
 * Platform credit will be used in case we need to track
 * expense of a wallet (say multiple plaid bank accounts) 
 *  
 * */ 

const PlatformCreditSchema = new Schema(
    {

        name:{
            type: String,
            default: ''      
        },


        balance:{
            type:Number,
            default:0
        },

        currency:{
            type: String,
            default: 'usd'
        },

        lastMonthlyBilled:{
            type: Date,
            default: Date.now
        },

        bankAccounts:[{
            type: Schema.Types.ObjectId,
            ref: 'PlaidBankAccount'    
        }],

        wallets:[{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'  
        }],

        primaryWallet:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet' 
        },

        addedBy:{
            type: Schema.Types.ObjectId,
            ref: 'Profile'  
        },
    
        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

    }
)

const PlatformCredit = model('PlatformCredit', PlatformCreditSchema);

module.exports = PlatformCredit;