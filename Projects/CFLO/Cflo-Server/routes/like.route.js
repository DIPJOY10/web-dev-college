const {like, getPostLikes} = require("../controllers/like.controller");

module.exports = app => {
    app.post("/api/like/like", like);
    app.post("/api/like/getPostLikes", getPostLikes);
};
