/**
 * https://medium.com/swlh/crud-operations-on-mongodb-tree-data-structure-f5afaeca1550
 */

const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const CategorySchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
        },

        type: {
            type: String,
            enum: ["skill", "assetType", "appRelated", "other"]
        },

        description: {
            type: String
        },

        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category'
        },

        addedBy: {
            type: Schema.Types.ObjectId,
            ref: 'Profile'
        },

        ancestors: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true
    }
)

const Category = model('Category', CategorySchema);

module.exports = Category;