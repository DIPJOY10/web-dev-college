var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const BillItemSchema = new mongoose.Schema({
    offeringRelation: {
        type: Schema.Types.ObjectId,
        ref: "OfferingRelation",
    },

    isOfferingObj: {
        type: Boolean,
        default: true,
    },

    chartAccount: {
        type: Schema.Types.ObjectId,
        ref: "ChartAccount",
    },

    name: {
        type: String,
        default: "",
    },

    description: {
        type: String,
        default: "",
    },

    qTy: {
        type: Number,
        default: 0,
    },

    rate: {
        //Amount
        type: Number,
        default: 0,
    },
    tax: {
        type: Boolean,
        default: false,
    },

    created: {
        type: Date,
        default: Date.now,
    },

    billList: {
        type: Schema.Types.ObjectId,
        ref: "BillList",
    },
});

var BillItem = mongoose.model("BillItem", BillItemSchema);

module.exports = BillItem;
