const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const DocFolderSchema = new Schema(
    {

        title: {
            type: String,
            default: ''
        },

        description: {
            type: Object,
            default: ''
        },

        shared: [{
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        }],

        comments: [{
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }],

        /**
         * Below parameters are used for access management
         */

        parent: {
            type: Schema.Types.ObjectId,
            refPath: "parentModelName",
        },

        parentModelName: {
            type: String,
        },


        profile: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },

        assigned: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],

    },
    {
        timestamps: true
    }
)

const DocFolder = model('DocFolder', DocFolderSchema);

module.exports = DocFolder