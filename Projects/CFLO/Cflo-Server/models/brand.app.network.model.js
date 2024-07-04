const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const BrandAppNetworkSchema = new Schema(
    {   

        nickName:{
            type:String,
        },

        passcode:{
            type:String,
        },

        brandApp:{
            type:Schema.Types.ObjectId,
            ref:'BrandApp'
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        access:[{
            type:Schema.Types.ObjectId,
            ref:'Profile'
        }],

        ownerShip:{
            type:Schema.Types.ObjectId,
            ref:'Profile'
        },

        user:{
            type:Schema.Types.ObjectId,
            ref: 'User'
        },

    },
    {
      timestamps: true
    }
);

const BrandAppNetwork = model('BrandAppNetwork', BrandAppNetworkSchema);

module.exports = BrandAppNetwork;