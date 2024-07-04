const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const ComparedReportSchema = new Schema(
    {
        reports: [{
            type: Schema.Types.ObjectId,
            refPath: 'Report'
        }],

        criteriaPolicy: {
            type: Schema.Types.ObjectId,
            refPath: 'PurchasePolicy'
        },

        compareType: {
            type: String
        },

        profile: {
            type: Schema.Types.ObjectId,
            refPath: 'Profile'
        }
    },
    {
        timestamps: true
    }
);

const ComparedReport = model('ComparedReport', ComparedReportSchema);
module.exports = ComparedReport;