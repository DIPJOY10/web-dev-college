const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const DocSchema = new Schema(
    {
        docType: {
            type: String,
            enum: ["ESIGN_TEMPLATE", "ESIGN_ENVELOPE", "DOCUMENT", "PUBLICDOC"],
            default: "DOCUMENT",
        },
        parentTemplate: {
            type: Schema.Types.ObjectId,
            ref: "Doc",
        },
        //--------------------------
        // templateGenerated : {
        //     status : false,
        //     parentID : ID
        // }
        title: {
            type: String,
            default: "",
        },

        countryTag: [{
            type: String,
            default: "",
        }],

        nationwide: [{
            type: String,
            default: "",
        }],

        stateTags: [{
            type: String,
            default: "",
        }],

        description: {
            type: String,
            default: "",
        },

        tagStrs: [{
            type: String,
            default: "",
        }],

        tags: [{
            type: Schema.Types.ObjectId,
            ref: "Category",
        }],

        versions: [
            {
                type: Schema.Types.ObjectId,
                ref: "Doc",
            },
        ],

        links: [
            {
                title: { type: String, default: "" },
                link: { type: String, default: "" },
            },
        ],

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
        //docusign tracker
        signTracker: {
            provider: {
                type: String,
                enum: ["DOCUSIGN", "HELLOSIGN"],
                default: "DOCUSIGN",
            },
            id: {
                type: String,
                default: "",
            },
            status: {
                type: String,
                default: "No Status",
            },
        },
        signData: {
            recepientName: {
                type: String,
                default: "",
            },
            recepientMail: {
                type: String,
                default: "",
            },
            ccName: {
                type: String,
                default: "",
            },
            ccMail: {
                type: String,
                default: "",
            },
        },
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

        shared: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        assigned: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        activeUserId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        activeUserProfile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    },
    {
        timestamps: true,
    }
);

const Doc = model("Doc", DocSchema);

module.exports = Doc;
