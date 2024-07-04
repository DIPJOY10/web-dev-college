const {create, update, getDetail, createMilestone, updateMilestone} = require("../controllers/payment.schedule");

module.exports = app => {
    app.post("/api/schedule/payment/create", create);
    app.post("/api/schedule/payment/update", update);
    app.post("/api/schedule/payment/get", getDetail);
    app.post("/api/schedule/payment/milestone/create", createMilestone);
    app.post("/api/schedule/payment/milestone/update", updateMilestone);
};
