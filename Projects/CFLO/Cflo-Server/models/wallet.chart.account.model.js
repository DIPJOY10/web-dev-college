const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const ChartAccountSchema = new Schema(
    {        
        balance:{
            type: Number,
            default:0
        },   

        name:{
            type:String,
            default:'Cost of Labor' 
        },

        description:{
            type:String,
            default:'' 
        },

        wallet:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'
        },

        parent:{
            type: Schema.Types.ObjectId,
            ref: 'ChartAccount'
        },

        ancestors:[{
            type: Schema.Types.ObjectId,
            ref: 'ChartAccount'
        }],

        isSubAccount:{
            type: Boolean,
            default: false  
        },

        //categories
        topLevel:{
            type:String,
            default:'Expense',
            enum: ['Asset', 'Equity', 'Expense', 'Liability', 'Revenue'] 
        },

        //types account.js
        classification:{
            type:String,
            default:''   
        },

        //subTypes account.js
        qbType:{
            type:String,
            default:'CostOfLabor'     
        },
         //subTypes account.js
        qbName:{
            type:String,
            default:'CostOfLabor'     
        },

        debit: {
            type: Boolean,
            default: true           
        }

    }
);

const ChartAccount = model('ChartAccount', ChartAccountSchema);

module.exports = ChartAccount;
