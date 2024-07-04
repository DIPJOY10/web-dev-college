const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const RentalRequestSchema = new Schema(
    {

        passcode:{
            type: String
        },

        brandApp:{
            type: Schema.Types.ObjectId,
            ref: 'BrandApp'  
        },

        brandAppNetwork:{
            type: Schema.Types.ObjectId,
            ref: 'BrandAppNetwork'  
        },

        createdAt: {
            type: Date,
            default: Date.now
        },

        tenant:{
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },



        rentalRelation:{
            type: Schema.Types.ObjectId,
            ref:'RentalRelation'
        },

        status:{
            type: String,
            enum: [ 'processing','accepted','rejected'],
            default:'processing'
        },

        acceptOrReject:{
            time:{
                type: Date,
                default: Date.now
            },
  
        },


    },
    {
      timestamps: true
    }
)

const RentalRequest = model('RentalRequest', RentalRequestSchema);

module.exports = RentalRequest