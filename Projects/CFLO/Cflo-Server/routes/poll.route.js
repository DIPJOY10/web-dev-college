const {vote} = require("../controllers/poll.controller");

module.exports = app => {
    app.post("/api/poll/vote", vote);
};
