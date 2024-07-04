var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const IssueProjectSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: "",
        },
        units: [
            {
                issue: {
                    type: Schema.Types.ObjectId,
                    refPath: "Issue",
                },
                connectedToStart: {
                    type: Boolean,
                },
                connectedToEnd: {
                    type: Boolean,
                },
                source: [
                    {
                        type: Schema.Types.ObjectId,
                        refPath: "Issue",
                    },
                ],
                destination: [
                    {
                        type: Schema.Types.ObjectId,
                        refPath: "Issue",
                    },
                ],
            },
        ],
        shared: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        profile: {
            type: Schema.Types.ObjectId,
            ref: "Profile",
        },

        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);
const IssueProject = mongoose.model("IssueProject", IssueProjectSchema);

module.exports = IssueProject;
