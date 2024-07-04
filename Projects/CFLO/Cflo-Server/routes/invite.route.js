const {
    getInvitation,
    updateInvite,
    getUserInvites,
    getTeamInvites,
    inviteTeam,
    onInviteAccept,
    onInviteReject,
    getSentInvites,
} = require("../controllers/invite.controller");

module.exports = app => {
    app.post("/api/invite/get", getInvitation);
    app.post("/api/invite/create", inviteTeam);
    app.post("/api/invite/update", updateInvite);
    app.post("/api/invite/getUserInvites", getUserInvites);
    app.post("/api/invite/getTeamInvites", getTeamInvites);
    app.post("/api/invite/accept", onInviteAccept);
    app.post("/api/invite/reject", onInviteReject);
    app.post("/api/invite/sentInvites", getSentInvites);
};
