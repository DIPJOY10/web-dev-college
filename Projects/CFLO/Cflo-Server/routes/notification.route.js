const {getNotifications} = require("../controllers/notification.controller");

module.exports = app => {
    app.post("/api/notification/get", getNotifications);
};
