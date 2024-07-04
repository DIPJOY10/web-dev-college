const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const rentEstimateCompsSchema = new Schema({
    propertyType: {
        type: String,
    },
    address: {
        type: String,
    },
    rentEstimateComps: {
        comparableRentals: {
            type: Number,
        },
        percentile_25: {
            type: Number,
        },
        highRent: {
            type: Number,
        },
        lowRent: {
            type: Number,
        },
        lat: {
            type: Number,
        },
        median: {
            type: Number,
        },
        rent: {
            type: Number,
        },
        percentile_75: {
            type: Number,
        },
        long: {
            type: Number,
        }
    }
});

const RentEstimateComps = model("RentEstimateComps", rentEstimateCompsSchema);

module.exports = RentEstimateComps;
