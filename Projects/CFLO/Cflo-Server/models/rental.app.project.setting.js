const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const RentalAppProjectSchema = new Schema(
    {
   
        appNetwork:{
            type: Schema.Types.ObjectId,
            ref:'BrandAppNetwork'      
        },

        networkTeam:{
            type: Schema.Types.ObjectId,
            ref:'Team'    
        },

        project:{
            type: Schema.Types.ObjectId,
            ref:'Project'      
        },

        projectTeam:{
            type: Schema.Types.ObjectId,
            ref:'Team'      
        },

        profile:{
            type: Schema.Types.ObjectId,
            ref: 'Profile'   
        },
    

        user:{
            type: Schema.Types.ObjectId,
            ref:'User'   
        },

        platforms:[{
            provider:{
                type: String
            },
            account:{
                type: String
            }
        }],

        createdAt: {
            type: Date,
            default: Date.now
        },

    },
    {
      timestamps: true
    }
)

const RentalAppProject = model('RentalAppProject', RentalAppProjectSchema);

module.exports = RentalAppProject