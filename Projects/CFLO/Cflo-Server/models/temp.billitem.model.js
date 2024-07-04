var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const BillItemSchema = new mongoose.Schema({

    offering:{
        type: Schema.Types.ObjectId,
        ref: 'Offering'  
    },

    account:{
        type: Schema.Types.ObjectId,
        ref: 'ChartAccount'
    },

    debit:{
        type: Boolean,
        default: true
    },

    name:{
        type: String,
        default:''
    },

    description:{
        type: String,
        default:''
    },
  

    qTy:{
        type:Number,
        default:0      
    },

    rate:{
        type:Number,
        default:0      
    },


    tax:{
        type:Boolean,
        default:false
    },

    created:{
        type: Date,
        default: Date.now   
    },

    billList:{
        type: Schema.Types.ObjectId,
        ref: 'BillList'   
    }

})

var BillItem = mongoose.model('BillItem', BillItemSchema);

module.exports = BillItem;