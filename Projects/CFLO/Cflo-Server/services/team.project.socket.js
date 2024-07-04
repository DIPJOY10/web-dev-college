const Team = require("../models/team.model");
const socketApi = require("./socket");
const _ = require("lodash");

const teamProjectSocket = (req, profileId, teamId, socketBody) => {
    var profileId = "" + profileId;
    Team.findById(teamId)
        .populate({
            path: "ancestors",
        })
        .then(team => {
            var teamPeople = team.participants || [];
            var ancestorPeopleArr = team.ancestors ? team.ancestors.map(team => team.participants) || [] : [];
            var ancestorPeople = _.flattenDeep(ancestorPeopleArr);

            var participantIdSet = new Set([...teamPeople, ...ancestorPeople]);

            var participants = _.difference(Array.from(participantIdSet), [profileId]);

            socketApi(req, participants, socketBody);
        });
};

module.exports = teamProjectSocket;
