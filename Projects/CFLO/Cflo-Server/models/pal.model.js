const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const PalSchema = new Schema(
    {
        email: {
            type: String,
        },

        displayName: {
            type: String,
            default: "",
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },

        emails: [
            {
                type: String,
            },
        ],

        phones: [
            {
                type: String,
            },
        ],

        phone: {
            type: String,
        },

        model: {
            type: String,
            default: "Pal",
        },

        type: {
            type: String,
            default: "Organization",
            enum: ["Organization", "User"],
        },

        parent: {
            type: Schema.Types.ObjectId,
            refPath: "parentModelName",
        },

        parentModelName: {
            type: String,
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        address: {
            line1: {type: String, default: ""},
            postal_code: {type: String, default: ""},
            city: {type: String, default: ""},
            state: {type: String, default: ""},
            country: {type: String, default: ""},
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },
    },
    {
        timestamps: true,
    }
);

const Pal = model("Pal", PalSchema);

module.exports = Pal;
