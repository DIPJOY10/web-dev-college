var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const BankAccountSchema = new mongoose.Schema({

    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet' 
    },

    account:{
        type: Schema.Types.ObjectId,
        refPath:'accountType'   
    },

    accountType:{
        type:String 
    }

})

var BankAccount = mongoose.model('BankAccount', BankAccountSchema);

module.exports = BankAccount;