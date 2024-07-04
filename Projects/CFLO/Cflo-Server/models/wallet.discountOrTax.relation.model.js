const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const discountOrTaxRelationSchema = new Schema(
  {

    discountOrTax : {
        type : Schema.Types.ObjectId,
        ref: 'DisCountOrTax'  
    },

    chartAccount:{
      type : Schema.Types.ObjectId,
      ref: 'ChartAccount'  
    },

    name: {
      type: String,
      default:''
    },

    description: {
      type: String,
      default:''
    },

    model : {
      type:String,
      default:'Tax'
    },

    type:{
        type: String,
        default:'%',
        enum:['$','%']
    },

    amount:{
        type: Number,
        default:0    
    },

    percent:{
        type: Number,
        default:0   
    },

    vendor:{
      type: Schema.Types.ObjectId,
      ref: 'Profile'  
    },

    wallet : {
      type : Schema.Types.ObjectId,
      ref : 'Wallet'
    },

    addedBy:{
        type: Schema.Types.ObjectId,
        ref: 'Profile'  
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

  },
  {
    timestamps: true
  }
);


const DiscountOrTaxRelation = model('DiscountOrTaxRelation', discountOrTaxRelationSchema);

module.exports = DiscountOrTaxRelation;