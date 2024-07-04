const {create, update} = require("../controllers/scheduler.controller");

module.exports = app => {
    app.post("/api/scheduler/create", create);
    app.post("/api/scheduler/update", update);
};
