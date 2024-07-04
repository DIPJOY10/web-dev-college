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
                type: Schema.Types.ObjectId,
                ref: 'JournalStep',
            }
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
