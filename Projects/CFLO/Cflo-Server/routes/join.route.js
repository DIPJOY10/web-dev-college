const {
    createJoin,
    deleteJoin,
    updateJoin,
    isJoined,
    getCommunityJoins,
    updateProgress,
} = require("../controllers/join.controller");

module.exports = app => {
    app.post("/api/join/create", createJoin);
    app.post("/api/join/delete", deleteJoin);
    app.post("/api/join/update", updateJoin);
    app.post("/api/join/isJoined", isJoined);
    app.post("/api/join/communityJoins", getCommunityJoins);
    app.post("/api/join/updateProgress", updateProgress);
};
