const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const ServiceSchema = new Schema(
  {

    name: {
      type: String,
      default:''
    },

    doYouOwnIt:{
      type: Boolean,
      default: false
    },

    description: {
      type: String,
      default:''
    },

    model:{
      type:String,
      default:'Service'
    },

    isInventory:{
      type: Boolean,
      default: false
    },

    taxRate:{
      type: Number,
      default:0
    },

    price :{
      type: Number,
      default:0
    },

    vendor:{
      type: Schema.Types.ObjectId,
      ref: 'Profile'  
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


const Service = model('Service', ServiceSchema);

module.exports = Service;