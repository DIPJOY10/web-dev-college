var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const PlaidBankAccountSchema = new mongoose.Schema({

    institution:{
        name:{
            type: String,
            default:''      
        },
        institution_id:{
            type: String,
            default:''
        }
    }, 

    exchangeToken:{
        accessToken: {
            type: String,
            default:''
        },
        itemId:{
            type: String,
            default:''
        },
        publicToken:{
            type: String,
            default:''  
        }  
    },

    accounts:[
        {   
            id: {
                type: String,
                default:''      
            },

            name:{
                type: String,
                default:''      
            }, 

            access_token :{
                type: String,
                default:''      
            }, 

            type: {
                type: String,
                default:''      
            },

            subtype: {
                type: String,
                default:''      
            }, 

            mask: {
                type: String,
                default:''      
            },

            stripeTokenCreated:{
                type:Boolean,
                default: false
            },

            stripeToken:{
                type: String,
            },

            
        }
    ]

})

var PlaidBankAccount = mongoose.model('PlaidBankAccount', PlaidBankAccountSchema);

module.exports = PlaidBankAccount;