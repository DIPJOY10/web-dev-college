const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const DocDraftSchema = new Schema(
    {
        title: {
            type: String,
            default: "",
        },

        description: {
            type: Object,
            default: "",
        },

        links: [
            {
                title: {type: String, default: ""},
                link: {type: String, default: ""},
            },
        ],
        parentDoc: {
            type: Schema.Types.ObjectId,
            ref: "Doc",
        },

        changes: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

const DocDraft = model("DocDraft", DocDraftSchema);

module.exports = DocDraft;
