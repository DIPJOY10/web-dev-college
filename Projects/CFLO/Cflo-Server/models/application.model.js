const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const ApplicationSchema = new Schema(
    {

        parent:{
            type: Schema.Types.ObjectId,
            refPath: 'parentModelName'
        },
    
        parentModelName:{
            type:String
        },  

        /**
         * Ticket work for investment
         */

        ticket:{
            amount:{
                type: Number,
                default:0
            },
    
            currency:{
                type:String,
                default:'usd'
            },
    

        },

        /**
         *  Job payType work
         */

        payType:{
        
            fixed:{
                type : Number 
            },   
        
            negoMin:{
                type : Number 
            },
        
            negoMax:{
                type : Number     
            },
        
            minAssured:{
                type : Number  
            },
        
            incentive:{
                type : Number   
            },
        
            hourly:{
                type : Number    
            },
        },

        message: {
            type: String,
            default: ''
        },

        numComments:{
            type: Number,
            default:0           
        },

        topComment:{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        },       

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        profile:{
            type: Schema.Types.ObjectId,
            ref: 'Profile' 
        },


        files:[{
            type:Schema.Types.ObjectId,
            ref: 'File'
        }],
        
        docs:[{
            type: Schema.Types.ObjectId,
            ref: 'Doc'
        }],

       folders:[{
            type: Schema.Types.ObjectId,
            ref: 'DocFolder'     
       }],

        published:{
            type:Boolean,
            default:false
        },

        createdAt: {
          type: Date,
          default: Date.now
        },

        status:{
            type : String  
        },
    
        basic:{
            type : Number 
        },   
    
        hourly:{
            type : Number    
        },
    },{
        timestamps:true
    }
)

const Application = model('Application', ApplicationSchema);

module.exports = Application;