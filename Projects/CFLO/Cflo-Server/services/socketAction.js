const Activity = require("../models/activity.model");
const socketAPI = require("./socket");

const socketAction = (activityBody, profiles) => {
    let activity = new Activity(activityBody);
    let activity = activity.save();
    socketAPI(req, profiles, activity);
};

module.exports = {
    socketAction,
};
