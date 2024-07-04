const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const JournalLineSchema = new Schema(
    {        

        account:{
            type: Schema.Types.ObjectId,
            ref: 'ChartAccount'
        },

        wallet:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

        journalEntry : {
            type: Schema.Types.ObjectId,
            ref: 'JournalEntry'
        },

        debit:{
            type: Boolean,
            default: true
        },

        amount:{
            type: Number,
            default:0
        },  
 
        createdAt: {
            type: Date,
            default: Date.now
        },

        transaction:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction'    
        },

        deleted:{
            type: Boolean,
            default: false    
        },

        name:{
            type: String,
            default:''
        },
        
        description:{
            type: String,
            default:''
        },    

    },
    {
      timestamps: true
    }
);

const JournalLine = model('JournalLine', JournalLineSchema);

module.exports = JournalLine;