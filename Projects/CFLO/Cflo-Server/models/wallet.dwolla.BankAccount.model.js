const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const DwollaBankAccountSchema = new Schema({
       wallet : {
          type: Schema.Types.ObjectId,
          ref : "Wallet"
       },
       status : {
          type : String,
          default : "unverified"
       },
       bankAccountType: {
          type : String,
       },
       bankName: {
          type : String,
       },
       fingerprint:{
          type : String,
       },
       AddedAt : {
         type: Date,
         default: Date.now   
       },
       name : {
          type : String,
          default : ""   
       },
       url : {
          type : String,
          default : ""
       },
       dwollaCustomer : {
           type : String,
       },
       deleteStatus : {
          type : Boolean,
          default : false
       },
       anonymousUser : {
         type : Boolean,
         default : false
       },
       txId : {
          type : String,
       },
       isIAV : {
          type : Boolean,
          default : true
       }
});

const DwollaBankAccount = model("DwollaBankAccount", DwollaBankAccountSchema);

module.exports = DwollaBankAccount;
