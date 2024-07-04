var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const FinanceOfferingSchema = new mongoose.Schema({


    offering:{
        type: Schema.Types.ObjectId,
        ref: 'Offering'  
    },

    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },

    created:{
        type: Date,
        default: Date.now   
    }

})

var FinanceOffering = mongoose.model('FinanceOffering', FinanceOfferingSchema);

module.exports = FinanceOffering;