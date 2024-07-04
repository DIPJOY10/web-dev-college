var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const BillListSchema = new mongoose.Schema({
    items: [
        {
            type: Schema.Types.ObjectId,
            ref: "BillItem",
        },
    ],

    discountRelationModel: {
        type: Schema.Types.ObjectId,
        ref: "DiscountOrTaxRelation",
    },

    taxRelationModel: {
        type: Schema.Types.ObjectId,
        ref: "DiscountOrTaxRelation",
    },

    discount: {
        enabled: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "$",
            enum: ["$", "%"],
        },
        amount: {
            type: Number,
            default: 0,
        },
        percent: {
            type: Number,
            default: 0,
        },
    },

    tax: {
        enabled: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: "%",
            enum: ["$", "%"],
        },
        amount: {
            type: Number,
            default: 0,
        },
        percent: {
            type: Number,
            default: 0,
        },
    },

    orderReverse: {
        type: Boolean,
        default: false,
    },

    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
    },

    parentModelName: {
        type: String,
    },
});

var BillList = mongoose.model("BillList", BillListSchema);

module.exports = BillList;
