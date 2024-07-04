const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const StripePaymentIntentSchema = new Schema({
    stripeId: {
        type: String,
    },

    clientSecret: {
        type: String,
    },

    checkout: {
        type: Schema.Types.ObjectId,
        ref: "Checkout",
    },
});

const StripePaymentIntent = model("StripePaymentIntent", StripePaymentIntentSchema);

module.exports = StripePaymentIntent;
