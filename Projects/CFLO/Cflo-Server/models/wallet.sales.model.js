var mongoose = require('mongoose');

var Schema = mongoose.Schema;


const SaleSchema = new mongoose.Schema({

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

    createdAt: {
        type: Date,
        default: Date.now
    }

})

var Sale = mongoose.model('Sale', SaleSchema);

module.exports = Sale;