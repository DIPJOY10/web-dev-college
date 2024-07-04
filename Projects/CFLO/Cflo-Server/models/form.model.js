var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var FormSchema = new mongoose.Schema({

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile'
    },
    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
    },

    parentModelName: {
        type: String,
    },

    name: String,

    description: {
        type: String,
        default: ""
    },
    shared: [
        {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    ],

    questions: [{
        type: Schema.Types.ObjectId,
        ref: 'Question'
    }],
    formType: { type: String }

}, { timestamps: true });

const Form = mongoose.model('Form', FormSchema);

module.exports = Form; 
