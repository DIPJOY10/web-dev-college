const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const SyndicateSchema = new Schema(
    {    
        basic:{
            type: Schema.Types.ObjectId,
            ref: 'Basic'         
        },

        projects:[{
            type: Schema.Types.ObjectId,
            ref: 'Project'     
        }],

        user:{
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
    
        participants:[{
            type: Schema.Types.ObjectId,
            ref: 'User'        
        }],

        allTimeMembers:[{
            type: Schema.Types.ObjectId,
            ref: 'User'        
        }],

        permissions:{
            type: Map,
            of: String
        },
    }
)

const Syndicate = model('Syndicate', SyndicateSchema);

module.exports = Syndicate;