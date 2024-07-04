const  mongoose =  require('mongoose');
const { Schema, model } = mongoose;

const DwollaCustomerSchema = new Schema(
    {    
        dwollaPath:{
            type: String  
        },
        type:{
            type: String  
        },
        name : {
            type : String
        },
        email : {
           type : String,
        },
        verified:{
            type: Boolean,
            default:false
        },
        wallet:{
            type:Schema.Types.ObjectId,
            ref: 'Wallet'
        },    
        anonymousUser : {
            type : Boolean,
            default : false
        },
        txId : {
             type : String,
        },
    }
)

const DwollaCustomer = model('DwollaCustomer', DwollaCustomerSchema);
module.exports = DwollaCustomer;