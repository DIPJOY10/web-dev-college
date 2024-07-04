const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const JournalEntrySchema = new Schema(
    {        
        reverse:{
            type : Boolean,
            default : false
        },

        journalEntryNo:{
            type : Number,
            default : 0
        },

        title:{
            type : String,
            default:''
        },

        memo:{
            type : String,
            default:''
        },

        date : {
            type: Date,
            default: Date.now
        },

        files:[{
            type:Schema.Types.ObjectId,
            ref: 'File'
        }],

        wallet:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

        entries:[{
            type: Schema.Types.ObjectId,
            ref: 'JournalLine'
        }],

        transaction:{
            type: Schema.Types.ObjectId,
            ref: 'Transaction'
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },
    
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        deleted : {
            type : Boolean,
            default : false
        },

        manual : {
            type : Boolean,
            default : false
        },

        processed : {
            type : Boolean,
            default : false
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    },
    {
      timestamps: true
    }
);

const JournalEntry = model('JournalEntry', JournalEntrySchema);

module.exports = JournalEntry;
