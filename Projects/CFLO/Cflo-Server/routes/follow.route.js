const {
    follow,
    unfollow,
    getFollowers,
    getFollowing,
    isFollowing,
    getNonFollowedCommunities,
} = require("../controllers/follow.controller");

module.exports = app => {
    app.post("/api/follow/follow", follow);
    app.post("/api/follow/unfollow", unfollow);
    app.post("/api/follow/followers", getFollowers);
    app.post("/api/follow/following", getFollowing);
    app.post("/api/follow/isfollowing", isFollowing);
};
