var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const FinanceRelationSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Customer", "Employee", "Contractor", "Vendor", "Investor", "Lender", "Other"],
    },
    //the person being add
    profile: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },
    // your profile
    addedBy: {
        type: Schema.Types.ObjectId,
        ref: "Profile",
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    // your profiles wallet
    wallet: {
        type: Schema.Types.ObjectId,
        ref: "Wallet",
    },
    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
    },

    parentModelName: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
});

var FinanceRelation = mongoose.model("FinanceRelation", FinanceRelationSchema);

module.exports = FinanceRelation;
