const {
    getUserNotifications,
    getMyActivity,
    // getPlatform, getActivities,
    setActivities,
    getTeamActivities,
    getParentActivities,
    getDataModelActivites,
} = require("../controllers/activity.controller");

module.exports = app => {
    app.post("/api/activity/notifications", getUserNotifications);
    app.post("/api/activity/my", getMyActivity);
    app.post("/api/activity/update", setActivities);
    app.post("/api/activity/team", getTeamActivities);
    app.post("/api/activity/get-parent", getParentActivities);
    app.post("/api/activity/get-dataModel", getDataModelActivites);
    // app.post('/api/activity/get', getActivities);
    // app.post('/api/activity/platform', getPlatform);
};
