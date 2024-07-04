var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const PaymentConfigSchema = new mongoose.Schema({

    providers:[{
        type: String,
    }],

    dwollaConfig:{

    },

    stripeConfig:{

    },

    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },

    parent:{
        type: Schema.Types.ObjectId,
        refPath: 'parentModelName'
    },

    parentModelName:{
        type:String
    },
  

},
{
  timestamps: true
})

var PaymentConfig = mongoose.model('PaymentConfig', PaymentConfigSchema);

module.exports = PaymentConfig;