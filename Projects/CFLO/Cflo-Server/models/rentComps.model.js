const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const rentCompsSchema = new Schema({
    zpid: {
        type: Number,
    },
    rentComps: [{
        bathrooms: {
            type: Number,
        },
        bedrooms: {
            type: Number,
        },
        miniCardPhotos: [{
            url: {
                type: String,
            }
        }],
        zpid: {
            type: Number,
        },
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        },
        address: {
            city: {
                type: String,
            },
            state: {
                type: String,
            },
            streetAddress: {
                type: String,
            },
            zipcode: {
                type: String,
            }
        },
        livingArea: {
            type: Number,
        },
        homeType: {
            type: String,
        },
        price: {
            type: Number,
        }
    }],
});

const RentComps = model("RentComps", rentCompsSchema);

module.exports = RentComps;
