const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const JournalRuleSchema = new Schema(
    {
        type: {
            type: String,
            default: "Invoice",
        },

        useAsDefault: {
            type: Boolean,
            default: false,
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },

        steps: [
            {
                account: {
                    type: Schema.Types.ObjectId,
                    ref: "ChartAccount",
                },

                accountDebit: {
                    type: Boolean,
                    default: false,
                },

                accountNext: {
                    type: Schema.Types.ObjectId,
                    ref: "ChartAccount",
                },
            },
        ],

        name: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

const JournalRule = model("JournalRule", JournalRuleSchema);

module.exports = JournalRule;
