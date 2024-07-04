const {
    createCommunity,
    updateCommunity,
    getCommunity,
    deleteCommunity,
    addModerator,
    removeModerator,
    getJoinedCommunities,
    getUsersModerationCommunities,
    getTopSuggestedCommunities,
    searchCommunityList,
} = require("../controllers/community.controller");

module.exports = app => {
    app.post("/api/community/create", createCommunity);
    app.post("/api/community/update", updateCommunity);
    app.post("/api/community/get", getCommunity);
    app.post("/api/community/delete", deleteCommunity);
    app.post("/api/community/add-moderator", addModerator);
    app.post("/api/community/remove-moderator", removeModerator);
    app.post("/api/community/get-joined", getJoinedCommunities);
    app.post("/api/community/get-moderation", getUsersModerationCommunities);
    app.post("/api/community/get-suggested", getTopSuggestedCommunities);
    app.post("/api/community/search", searchCommunityList);
};
