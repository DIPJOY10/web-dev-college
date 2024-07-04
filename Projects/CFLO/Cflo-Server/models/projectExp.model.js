const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ProjectExpSchema = new Schema(
    {
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },

        desc: {
            type: String,
            default: "",
        },

        role: {
            type: String,
            default: "",
        },

        startMonth: {
            type: String,
            default: "",
        },

        startYear: {
            type: String,
            default: "",
        },

        endMonth: {
            type: String,
            default: "",
        },

        endYear: {
            type: String,
            default: "",
        },

        isCurrentlyWorking: {
            type: Boolean,
            default: false,
        },

        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        }
    },
    {
        timestamps: true,
    }
);

const ProjectExp = model("ProjectExp", ProjectExpSchema);

module.exports = ProjectExp;
