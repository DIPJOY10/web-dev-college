const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const PackageSchema = new Schema(
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
      default:'Package'
    },

    items:[{
        item: {
            type: Schema.Types.ObjectId,
            ref: 'Offering'
        },
        qty:{
            type: Number,
            default: 0
        }
    }],

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


const Package = model('Package', PackageSchema);

module.exports = Package;