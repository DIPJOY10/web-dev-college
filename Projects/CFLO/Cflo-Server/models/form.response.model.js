const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const FormResponseSchema = new Schema(
    {
 
        issue: {
            type: Schema.Types.ObjectId,
            ref: 'Issue'
        },
        
        form: {
            type: Schema.Types.ObjectId,
            ref: 'Form'
        },
        
        question: {
            type: Schema.Types.ObjectId,
            ref: 'Question'
        },

        option:{
            type: Schema.Types.ObjectId,
            ref: 'FormOption'
        },

        optionCol:{
            type: Schema.Types.ObjectId,
            ref: 'FormOption'
        },
        options:[{
            type: Schema.Types.ObjectId,
            ref: 'FormOption'
        }],

        optionCols:[{
            type: Schema.Types.ObjectId,
            ref: 'FormOption'
        }],

        text:{
            type: String, default: ""
        },

        value:{ type: Number, default: 0},

        boolean:{ type: Boolean, default: false},

        time:{ 
            type: Date,
            default: Date.now   
        },

        files: [{
            type: Schema.Types.ObjectId,
            ref: 'File'
        }],

        parent:{
            type: Schema.Types.ObjectId,
            refPath: 'parentModelName'
        },
    
        parentModelName:{
            type:String
        },
      
    },
    {
        timestamps: true,
    }
);

const FormResponse = model("FormResponse", FormResponseSchema);

module.exports = FormResponse;
