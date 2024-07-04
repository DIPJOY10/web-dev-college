const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const PipelineSchema = new Schema(
    {
        
        name:{
            type : String      
        },
        
        type:{
            type : String      
        },

        states:[{
            type : String  
        }],

        finalStates:[{
            type : String  
        }],

        stateColor:{
            type: Map,
            of: String
        },

        labels:[{
            type : String  
        }],

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        teams:[{
            type: Schema.Types.ObjectId,
            ref: 'Team'
        }],

        platform:{
            type: Boolean,
            default:false
        }

    }
)

const Pipeline = model('Pipeline', PipelineSchema);

module.exports = Pipeline;