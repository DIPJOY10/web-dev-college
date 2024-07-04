const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const OfferingSchema = new Schema(
  {

    name: {
      type: String,
      default:''
    },

    description: {
      type: String,
      default:''
    },

    model:{
      type:String,
      default:'Product'
    },

    default : {
      type: Boolean,
      default:false
    },

    isInventory:{
      type: Boolean,
      default: false
    },

    price :{
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


const Offering = model('Offering', OfferingSchema);

module.exports = Offering;