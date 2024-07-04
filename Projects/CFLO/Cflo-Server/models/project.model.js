const mongoose = require("mongoose");
const pointSchema = require("./location.point.model");
const { Schema, model } = mongoose;

const ProjectSchema = new Schema(
    {
        email: {
            type: String,
        },

        displayName: {
            type: String,
            default: "",
        },

        displayPicture: {
            type: Schema.Types.ObjectId,
            ref: "File",
        },

        wallet: {
            type: Schema.Types.ObjectId,
            ref: "Wallet",
        },

        sample: {
            type: Boolean,
            default: false,
        },

        model: {
            type: String,
            default: "Project",
        },

        projectIdCode: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            default: "",
        },

        currency: {
            type: String,
        },

        user: {
            type: Schema.Types.ObjectId,
            refPath: "userModelName",
        },

        userModelName: {
            type: String,
            enum: ["User", "Organization"],
        },

        phone: {
            type: String,
            default: "",
        },

        companyNo: {
            type: String,
            default: "",
        },

        rentalRelation: {
            type: mongoose.Types.ObjectId,
            ref: "rentalrelations",
        },

        // creator will always be linked to a human
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        ownerProfile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        createrProfile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        propertyTypes: [
            {
                type: Schema.Types.ObjectId,
                ref: "Category",
            },
        ],

        numUnits: {
            type: Number,
            default: 0,
        },

        unitNames: [
            {
                type: String,
            },
        ],

        projectTaxRate: {
            type: String,
        },

        propertyTaxRate: {
            type: Number,
            default: 0,
        },

        taxAnnualAmount: {
            type: Number,
            default: 0,
        },

        annualHomeownersInsurance: {
            type: Number,
            default: 0,
        },

        propName: {
            type: String,
        },

        shortDesc: {
            type: String,
        },

        address: {
            fullAddressLine: { type: String, default: "" },
            streetAddress: { type: String, default: "" },
            zip: { type: String, default: "" },
            city: { type: String, default: "" },
            region: { type: String, default: "" },
            regionCode: { type: String, default: "" },
            country: { type: String, default: "" },
        },

        category: {
            type: String,
        },

        subCategory: {
            type: String,
        },

        area: {
            type: Number,
        },

        year: {
            type: Number,
        },

        parking: {
            type: String,
        },

        lotSize: {
            type: String,
        },

        lotSizeDimensions: {
            type: String,
            default: ""
        },

        livingAreaUnits: {
            type: String
        },

        pricePerSquareFoot: {
            type: Number,
            default: 0,
        },

        zoning: {
            type: String,
        },

        mls: {
            type: String,
            default: "",
        },

        roomNumbers: {
            type: Number,
            default: 0,
        },

        bathNumbers: {
            type: Number,
            default: 0,
        },

        latitude: {
            type: Number,
        },

        longitude: {
            type: Number,
        },

        price: {
            type: Number,
            default: 0,
        },

        bathroomsPartial: {
            type: String,
            default: "",
        },

        bathroomsHalf: {
            type: Number,
            default: 0,
        },

        bathroomsFull: {
            type: Number,
            default: 0,
        },

        zestimate: {
            type: Number,
            default: 0,
        },

        rentZestimate: {
            type: Number,
            default: 0
        },

        totalActualRent: {
            type: Number,
            default: 0,
        },

        zpid: {
            type: Number,
            default: 0,
        },

        zestimateLowPercent: {
            type: String,
            default: "",
        },

        homeStatus: {
            type: String,
            default: "",
        },

        zestimateHighPercent: {
            type: String,
            default: "",
        },

        buyerAgencyCompensation: {
            type: String,
            default: "",
        },

        parcelNumber: {
            type: String,
            default: "",
        },

        stateId: {
            type: Number,
            default: 0,
        },

        countyId: {
            type: Number,
            default: 0,
        },

        isImported: {
            type: Boolean,
            default: false,
        },

        latestTaxHistory: {
            time: { type: Number },
            taxPaid: { type: Number, default: 0 },
            value: { type: Number, default: 0 }
        },

        nearbyHomes: [{
            zpid: { type: Number, default: "" },
            longitude: { type: Number, default: "" },
            price: { type: Number, default: "" },
            homeType: { type: String, default: "" },
            latitude: { type: Number, default: "" }
        }],

        priceHistory: [{
            date: { type: String, default: "" },
            price: { type: Number, default: 0 }
        }],

        location: {
            name: String,
            location: {
                type: pointSchema,
                index: "2dsphere", // Create a special 2dsphere index on `City.location`
            },
        },

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        docs: [
            {
                type: Schema.Types.ObjectId,
                ref: "Doc",
            },
        ],

        images: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            }
        ],

        purchasePolicy: {
            type: Schema.Types.ObjectId,
            Ref: "PurchasePolicy",
        },

        salesCompsId: {
            type: Schema.Types.ObjectId,
            Ref: "SalesComps",
        },

        rentCompsId: {
            type: Schema.Types.ObjectId,
            Ref: "RentComps",
        },

        rentEstimateId: {
            type: Schema.Types.ObjectId,
            Ref: "RentEstimateComps",
        }

    },
    {
        timestamps: true,
    },
    {
        typeKey: "$type",
    }
);

const Project = model("Project", ProjectSchema);

module.exports = Project;
