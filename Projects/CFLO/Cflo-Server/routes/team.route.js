const {
    getProfiles,
    getUserTeams,
    getUserOrgTeams,
    getDeepTeams,
    addParticipants,
    removeParticipants,
    changeMemberRole,
    teamData,
    teamBasicData,
    getTopProjects,
    getTeamsWithAdminOwnerPermisson,
} = require("../controllers/team.controller");

module.exports = app => {
    app.post("/api/team/getProfiles", getProfiles);
    app.post("/api/team/basic", teamBasicData);
    app.post("/api/team/data", teamData);
    app.post("/api/team/getDeepTeams", getDeepTeams);
    app.post("/api/team/getOrgTeams", getUserOrgTeams);

    app.post("/api/team/getTeams", getUserTeams);
    app.post("/api/team/addMembers", addParticipants);
    app.post("/api/team/removeMembers", removeParticipants);
    app.post("/api/team/changeMemberRole", changeMemberRole);

    app.post("/api/team/getTopProjects", getTopProjects);
    app.post("/api/team/getAdminOwnerPermissionTeams", getTeamsWithAdminOwnerPermisson);
};
