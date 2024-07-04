const Schedule = require("../models/scheduler.model");
const {
    findNextDateUpdate,
    findNextDateGenerator,
    findScheduleNextDateUpdate,
} = require("../scheduleJobs/scheduleHelper.js");
const {Schema} = require("mongoose");

const create = async (req, res) => {
    try {
        let schedule = new Schedule(req.body);
        await schedule.save();
        const nextDate = findScheduleNextDateUpdate(schedule);
        req.body.nextDate = nextDate;
        console.log("in controller ", {nextDate});
        schedule = await Schedule.findByIdAndUpdate(schedule._id, {nextDate}, {new: true});
        res.json({
            data: schedule,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong",
        });
    }
};

module.exports = {
    create,
};
