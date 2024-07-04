const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const disCountOrTaxSchema = new Schema(
  {
    name: {
      type: String,
      default:''
    },

    description: {
      type: String,
      default:''
    },

    default : {
      type: Boolean,
      default:false
    },

    model:{
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


const DisCountOrTax = model('DisCountOrTax', disCountOrTaxSchema);

module.exports = DisCountOrTax;