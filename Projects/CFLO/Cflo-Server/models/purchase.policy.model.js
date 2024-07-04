const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const purchasePolicySchema = new Schema({
    title: {
        type: "String",
        default: "",
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    BRRRR: {
        type: Schema.Types.ObjectId,
        Ref: "PurchaseCriteria",
    },
    Rental: {
        type: Schema.Types.ObjectId,
        Ref: "PurchaseCriteria",
    },
    Flip: {
        type: Schema.Types.ObjectId,
        Ref: "PurchaseCriteria",
    },
    profile: {
        type: Schema.Types.ObjectId,
        Ref: "Profile",
    }
});

const PurchasePolicy = model("PurchasePolicy", purchasePolicySchema);

module.exports = PurchasePolicy;
