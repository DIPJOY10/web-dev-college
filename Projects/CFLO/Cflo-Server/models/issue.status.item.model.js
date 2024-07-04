var mongoose = require("mongoose");

var Schema = mongoose.Schema;

const StatusItemSchema = new mongoose.Schema(
    {
        color:{
            type: String,
        },

        text: {
            type: String,
        },

        template:{
            type: Schema.Types.ObjectId,
            ref: "IssueTemplate"     
        }

    },
);

var StatusItem = mongoose.model("StatusItem", StatusItemSchema);

module.exports = StatusItem;