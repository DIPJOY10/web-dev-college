const {
    create,
    update,
    deletePost,
    getPostById,
    getAllFollowingPosts,
    getPostsData,
    getAllPostsOfCommunities,
    getPopularFeedPosts,
    getPopularForumPosts,
    getProfilePosts,
} = require("../controllers/post.controller");

module.exports = app => {
    app.post("/api/post/create", create);
    app.post("/api/post/update", update);
    app.post("/api/post/get", getPostById);
    app.post("/api/post/delete", deletePost);
    app.post("/api/post/getpostdata", getPostsData);
    app.post("/api/post/getProfilePost", getProfilePosts);
    app.post("/api/post/followingpost", getAllFollowingPosts);
    app.post("/api/post/communities-post", getAllPostsOfCommunities);
    app.post("/api/post/popular-feed-posts", getPopularFeedPosts);
    app.post("/api/post/popular-forum-posts", getPopularForumPosts);
};
