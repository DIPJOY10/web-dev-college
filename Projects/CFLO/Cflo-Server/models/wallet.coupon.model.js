var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const CouponSchema = new Schema({

    type:{
        type: String,
        default:'Subtract',
        enum:['Fix','Subtract']
    },

    subtractType:{
        type: String,
        default:'$',
        enum:['$','%']  
    },

    amount:{
        type: Number,
        default:0    
    },

    percentage:{
        type: Number,
        default:0 
    },

    code:{
        type: String
    }

})

var Coupon = mongoose.model('Coupon', CouponSchema);

module.exports = Coupon;