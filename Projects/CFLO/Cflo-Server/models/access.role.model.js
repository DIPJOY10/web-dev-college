const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const AccessRoleSchema = new mongoose.Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },

    role: {
        type: String,
    },

    //project and project id
    parent: {
        type: Schema.Types.ObjectId,
        refPath: 'parentModelName'
    },

    parentModelName: {
        type: String
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: 'Profile'
    },

    deleted: {
        type: Boolean,
        default: false,
    },

    deletedAt: {
        type: Date
    },

    createdAt : {
        type: Date,
        default: Date.now,
    }

}, {
    timestamps: true
});

const AccessRole = model('AccessRole', AccessRoleSchema);

module.exports = AccessRole
