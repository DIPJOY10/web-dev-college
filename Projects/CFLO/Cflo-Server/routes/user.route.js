const {
    update,
    getByIds,
    userList,
    getTopSuggestedUsers,
    getTopSuggestedUsersByLocation,
    updateForTransaction
} = require("../controllers/user.controller");

module.exports = app => {
    app.post("/api/user/update", update);
    app.post("/api/user/getByIds", getByIds);
    app.post("/api/user/userList", userList);
    app.post("/api/user/get-suggested", getTopSuggestedUsers);
    app.post("/api/user/get-suggested-by-location", getTopSuggestedUsersByLocation);
    app.post("/api/user/update/for/transaction", updateForTransaction);
};
