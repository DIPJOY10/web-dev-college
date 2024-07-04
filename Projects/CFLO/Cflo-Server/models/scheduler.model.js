const mongoose = require("mongoose");
const {Schema} = mongoose;

const scheduleSchema = new mongoose.Schema({
    scheduleType: {
        type: String,
        default: "Schedule",
    },
    intervalType: {
        type: String,
        default: "MonthlyByDate",
    },
    dayOrWeekOfMonth: {
        type: String,
        default: "Day",
    },
    afterXDays: {
        type: String,
        default: "0",
    },
    afterXWeeks: {
        //
        type: String,
        default: "0",
    },
    dayOfWeek: {
        //
        type: String,
        default: "Monday",
    },
    month: {
        //
        type: String,
        default: "January",
    },
    dayOfMonth: {
        //
        type: String,
        default: "1st",
    },
    afterXMonth: {
        //
        type: String,
        default: "0",
    },
    startDate: {
        //
        type: Date,
        default: Date.now,
    },
    nextDate: {
        type: Date,
        // default: "",
    },
    endType: {
        //
        type: String,
        default: "None",
    },
    stopDate: {
        type: Date,
        //
        default: Date.now,
    },
    numberOfOccurrences: {
        //
        type: Number,
        default: 0,
    },

    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
    },
    parentModelName: {
        type: String,
    },
    data: {
        type: Schema.Types.ObjectId,
        refPath: "dataModel",
    },
    dataModel: {
        type: String,
    },
    scheduled: {
        //scheduled===true means scheduler is handling it.
        type: Boolean,
        default: false,
    },
    recurring: {
        type: Boolean,
        default: false,
    },
    // readyToExecute: {
    //     //readyToExecute === true means task is ready to executed
    //     type: Boolean,
    //     default: false,
    // },
    lastExecutedResults: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Activity",
        },
    ],
    // isDependent: {
    //     type: Boolean,
    //     default: false,
    // },
    // dependents: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "Scheduler",
    //     },
    // ],
    // scheduleDaysInAdvance: {
    //     type: String,
    //     default: "",
    // },
});

scheduleSchema.index({scheduled: 1, nextDate: 1});
const Scheduler = mongoose.model("Scheduler", scheduleSchema);

module.exports = Scheduler;
