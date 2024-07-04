const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const RentalUnitSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        files: [
            {
                type: Schema.Types.ObjectId,
                ref: "File",
            },
        ],

        team: {
            type: Schema.Types.ObjectId,
            ref: "Team",
        },

        name: {
            type: String,
            default: "",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },

        numTenants: {
            //Ignore
            type: Number,
            default: 0,
        },

        rentalRelation: {
            //lease
            type: mongoose.Types.ObjectId,
            ref: "RentalRelation",
        },

        vacant: {
            type: Boolean,
            default: true,
        },

        location: {
            //Ignore
            line1: String,
            line2: String,
            city: String,
            state: String,
            zip: Number,
            country: Number,
        },
    },
    {
        timestamps: true,
    }
);

const RentalUnit = model("RentalUnit", RentalUnitSchema);

module.exports = RentalUnit;
