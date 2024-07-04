const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const ActivitySchema = new Schema(
    {
        type: {
            type: String,
            default: "",
        },

        title: {
            type: String,
            default: "",
        },

        body: {
            type: String,
            default: "",
        },

        //issue, document, transaction, comment, like etc created
        data: {
            type: Schema.Types.ObjectId,
            refPath: "dataModel",
        },

        dataModel: {
            type: String,
        },

        //community, team(orgs, projects), issue, document, transaction, etc created
        parent: {
            type: Schema.Types.ObjectId,
            refPath: "parentModelName",
        },

        parentModelName: {
            type: String,
        },

        adminOnly: {
            type: Boolean,
            default: false,
        },

        //Stores profile to notify
        notify: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        createdAt: {
            type: Date,
            default: Date.now,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
        raw:{
            type:String,
        },
    },
    {
        timestamps: true,
    }
);

const Activity = model("Activity", ActivitySchema);

module.exports = Activity;
