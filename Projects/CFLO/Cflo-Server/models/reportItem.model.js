const mongoose = require("mongoose");
const {Schema, model} = mongoose;

const ReportItemSchema = new Schema({
    teamId: {
        type: Schema.Types.ObjectId,
        Ref: "Team",
    },
    reportId: {
        type: Schema.Types.ObjectId,
    },
    ItemType: {
        type: String,
        default: "",
    },
    Name: {
        type: String,
        default: "",
    },
    Amount: {
        type: String,
        default: "",
    },
});

const ReportItem = model("ReportItem", ReportItemSchema);

module.exports = ReportItem;
