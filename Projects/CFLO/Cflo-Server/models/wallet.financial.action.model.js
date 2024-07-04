var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FinancialActionSchema = new mongoose.Schema({

    providers:[{
        type: String,
    }],

    dwollaConfig:{

    },

    stripeConfig:{

    },


    parent:{
        type: Schema.Types.ObjectId,
        refPath: 'parentModelName'
    },

    parentModelName:{
        type:String
    },


    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },

    walletReceiver:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'  
    }
  

},
{
  timestamps: true
})

var FinancialAction = mongoose.model('FinancialAction', FinancialActionSchema);

module.exports = FinancialAction;