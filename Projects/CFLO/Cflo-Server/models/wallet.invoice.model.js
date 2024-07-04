const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;


const InvoiceSchema = new Schema(
    {

        invNo:{
            type:Number
        },

        status:{
            type:String,
            default:'Draft',
            enum:['Draft','Sent','Opened','Partially Paid','Paid','Deposited']
        },

        files:[{
            type: Schema.Types.ObjectId,
            ref: 'File'
        }],

        memo:{
            type: String,
            default: ''      
        },

        currency:{
            type: String,
            default: 'usd'
        },

        lateFees:{
            type:Number,
            default:0
        },

        total:{
            type:Number,
            default:0
        },

        amountPaid:{
            type:Number,
            default:0
        },  

        billList:{
            type: Schema.Types.ObjectId,
            ref: 'BillList'    
        },

        dueDate:{
            type: Date,
            default: Date.now  
        },

        lateFeeApplicable:{
            type: Boolean,
            default: false
        },

        lateFeeAmount:{
            type: Number,
            default:0
        },

        lateFeeDate:{
            type: Date,
            default: Date.now  
        },

        term:{
            type: Schema.Types.ObjectId,
            ref: 'Term'
        },

        // receiver is the invoice property, customer is 
        // a wallet property

        customer:{
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },


        wallet:{
            type: Schema.Types.ObjectId,
            ref: 'Wallet'  
        },

        createdAt: {
            type: Date,
            default: Date.now
        }
    }
)

const Invoice = model('Invoice', InvoiceSchema);

module.exports = Invoice;