const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const PortfolioSchema = new Schema(
    {
        name: {
            type: String,
            default: "",
        },

        displayPicture: {
            type: Schema.Types.ObjectId,
            ref: "File",
        },

        access: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],

        accessWithRole: [
            {
                type: Schema.Types.ObjectId,
                ref: "AccessRole",
            },
        ],

        projects: {
            type: [
                {
                    projectProfile: {
                        type: Schema.Types.ObjectId,
                        ref: "Profile",
                    },
                    project: {
                        type: Schema.Types.ObjectId,
                        ref: "Project",
                    },
                    addedAt: {
                        type: Date,
                        default: Date.now,
                    },
                    addedBy: {
                        type: Schema.Types.ObjectId,
                        ref: "Profile",
                    },
                },
            ],
            default: [],
        },

        lastUpdatedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Portfolio = model("Portfolio", PortfolioSchema);

module.exports = Portfolio;
