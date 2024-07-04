const Scheduler = require("../models/scheduler.model");
const {Schema} = require("mongoose");
const nodeSchedule = require("node-schedule");
const moment = require("moment");

const {
    findNextDateUpdate,
    findNextDateGenerator,
    findScheduleNextDateUpdate,
} = require("../scheduleJobs/scheduleHelper.js");

const {rentalScheduleHandler} = require("../scheduleJobs/scheduleHandlers.js");

const create = async (req, res) => {
    try {
        if (!req.body.nextDate) req.body.nextDate = req.body.startDate;

        let schedule = new Scheduler(req.body);
        schedule = await schedule.save();
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

const update = async (req, res) => {
    try {
        const schdeulerId = req.body._id;
        const scheduler = await Scheduler.findByIdAndUpdate(schdeulerId, req.body, {new: true});
        res.json({
            data: scheduler,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: "Something went wrong",
        });
    }
};

const createSchedulerFromObject = async schedulerObj => {
    try {
        if (!schedulerObj?.nextDate) schedulerObj.nextDate = schedulerObj?.startDate;

        const scheduler = new Scheduler(schedulerObj);
        await scheduler.save();
        return scheduler;
    } catch (error) {
        throw new Error(error);
    }
};

const scheduleHandler = async schedule => {
    switch (schedule?.parentModelName) {
        case "RentalRelation":
            rentalScheduleHandler(schedule);
            break;
        case "email":
            console.log("Send Email");
            break;
        default:
            console.log(`${schedule?.parentModelName} is not handled`);
    }

    //updating next date
    const updateObj = {};
    if (schedule?.recurring) {
        updateObj.nextDate = await findScheduleNextDateUpdate(schedule?._id);
        console.log("Dates", updateObj.nextDate, schedule.stopDate);
        const nextDate = new Date(`${updateObj.nextDate}`);
        const stopDate = new Date(`${schedule.stopDate}`);
        console.log("dates", nextDate, stopDate);
        if (nextDate > stopDate) {
            //terminate the schedule
            delete updateObj.nextDate;
            updateObj.scheduled = false;
        }
    } else {
        //if schedule is not recurring, then stop it
        updateObj.scheduled = false;
    }

    // console.log("updateObj", updateObj);

    const newSchedule = await Scheduler.findByIdAndUpdate(schedule?._id, updateObj, {new: true});
    // console.log("newSchedule", newSchedule);
};

const processesSchedules = async () => {
    const schedules = await Scheduler.find({scheduled: true, nextDate: {$lte: moment().toISOString()}});
    console.log("all schedules", schedules);
    schedules.forEach(schedule => scheduleHandler(schedule));
};

const startSchedulerEngine = timePeriod => {
    const job = nodeSchedule.scheduleJob(timePeriod, () => {
        console.log("Scheduler runned");
        processesSchedules();
    });
};

module.exports = {
    create,
    update,
    createSchedulerFromObject,
    startSchedulerEngine,
};
