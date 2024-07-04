const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const RoleMapSchema = new Schema(
    {

        designation:{
            type:String,
            default:''
        },
        about:{
            type:String,
            default:''
        },

        profile:{
            type: Schema.Types.ObjectId,
            ref:'Profile'      
        },

    },
    {
      timestamps: true
    }
)

const RoleMap = model('RoleMap', RoleMapSchema);

module.exports = RoleMap