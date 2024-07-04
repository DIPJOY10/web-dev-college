const mongoose = require("mongoose");
const Team = require("../models/team.model");
const Task = require("../models/task.model");
const Issue = require("../models/issue.model");
const Doc = require("../models/doc.model");
const DocFolder = require("../models/doc.folder.model");
const CommentAndDiscussion = require("../models/commentAndDiscussion");
const { Discussion } = CommentAndDiscussion;
const Investment = require("../models/investment.model");
var labels = require("./labels");
var _ = require("lodash");
var async = require("async");

/**
 * This function is to be used in development only,
 *  it adds members directly in team without invites
 */

const getProfiles = (req, res) => {
    var teamIds = req.body.teamIds;

    Team.find({ _id: { $in: teamIds } })
        .select("participants permissions")
        .populate({
            path: "participants",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName wallet",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .then(teams => {
            res.status(200).json({
                data: teams,
            });
        });
};

const setTeam = () => {
    Team.find({})
        .populate({
            path: "parent",
            populate: {
                path: "user",
                model: "User",
            },
        })
        .then(teams => {
            try {
                async.map(
                    teams,
                    function (team, callback) {
                        try {
                            var user = team.parent.user;

                            var newTeamObject = {
                                _id: team._id,
                                user: user._id,
                            };

                            Team.findByIdAndUpdate(team._id, newTeamObject, { new: true }, function (err, resp) { });
                        } catch (error) {
                            console.log(error, " is the error", team);
                        }
                    },
                    function (err, results) {
                        // results now equals an array of the existing files
                    }
                );
            } catch (error) {
                console.log(error, " is the error");
            }
        });
};

const teamBasicData = (req, res) => {
    res.json(labels);
};

const getDeepTeams = (req, res) => {
    const teamIds = req.body.teamIds;
    async.map(
        teamIds,
        function (teamId, callback) {
            Team.find({ ancestors: { $in: [teamId] } })
                .populate({
                    path: "parent",
                    populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
                })
                .then(teams => {
                    callback(null, { teamId, teams });
                })
                .catch(err => {
                    callback(err);
                });
        },
        function (err, results) {
            res.status(200).json({
                data: results,
            });
        }
    );
};

const teamData = (req, res) => {
    var teamId = req.body.team;

    async.parallel(
        [
            function (callback) {
                Task.find({ team: teamId })
                    .populate([
                        {
                            path: "user",
                            select: "name displayName wallet model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    ])

                    .populate({
                        path: "profile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })

                    .sort({ createdAt: -1 })
                    .limit(3)
                    .then(tasks => {
                        callback(null, tasks);
                    });
            },

            function (callback) {
                Issue.find({ team: teamId })
                    .populate({
                        path: "user",
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    })
                    .populate({
                        path: "profile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .then(issues => {
                        callback(null, issues);
                    });
            },
            function (callback) {
                Investment.find({ team: teamId })
                    .populate([
                        {
                            path: "user",
                            select: "name displayName wallet model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    ])
                    .populate({
                        path: "profile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .then(investments => {
                        callback(null, investments);
                    });
            },

            function (callback) {
                Discussion.find({ team: teamId })
                    .populate({
                        path: "user",
                        select: "name displayName wallet model displayPicture",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    })
                    .populate({
                        path: "profile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .then(discussions => {
                        callback(null, discussions);
                    });
            },

            function (callback) {
                Doc.find({ teams: { $in: [teamId] } })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .populate({
                        path: "user",
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    })
                    .populate({
                        path: "profile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .populate("files")

                    .then(docs => {
                        callback(null, docs);
                    });
            },
            function (callback) {
                DocFolder.find({ teams: { $in: [teamId] } })
                    .sort({ createdAt: -1 })
                    .limit(3)
                    .populate({
                        path: "user",
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    })
                    .populate({
                        path: "profile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    })
                    .populate({ path: "docs" })

                    .then(docFolders => {
                        callback(null, docFolders);
                    });
            },
        ],
        function (err, results) {
            var tasks = results[0] ? results[0] : [];

            var issues = results[1] ? results[1] : [];
            var investments = results[2] ? results[2] : [];
            var discussions = results[3] ? results[3] : [];
            var docs = results[4] ? results[4] : [];
            var docFolders = results[5] ? results[5] : [];

            res.json({
                tasks,
                issues,
                discussions,
                docs,
                docFolders,
            });
        }
    );
};

const getAllAdminIdsHelper = async (userProfileId) => {
    let accessableOrgs = [];
    let adminProfileIds = [userProfileId];

    const orgTeams = await Team.find({
        participants: { $in: [userProfileId] },
        parentModelName: "Organization",
    })
        .populate({
            path: "parent",
            populate: [
                {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
                {
                    path: "cover",
                    model: "File",
                    select: "url thumbUrl",
                },
            ],
        })
        .populate({
            path: "participants",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName wallet",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        });

    orgTeams.map(team => {
        const perm = team.permissions;
        const role = perm.get(userProfileId);
        if (role == "Admin" || role == "Owner") {
            accessableOrgs.push(team);
            adminProfileIds.push(team?.parent?.profile);
        }
    });

    return {
        accessableOrgs,
        adminProfileIds,
    };
};

const getUserTeams = async (req, res) => {
    let userProfileId = req.body.profile;
    let accessableOrgsAndAdminIds = await getAllAdminIdsHelper(userProfileId);
    let accessableOrgs = accessableOrgsAndAdminIds.accessableOrgs;
    let adminIds = accessableOrgsAndAdminIds.adminProfileIds;

    const projectTeams = await Team.find({
        participants: { $in: adminIds },
        parentModelName: "Project",
    })
        .populate({
            path: "parent",
            populate: [
                {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
                {
                    path: "images",
                    model: "File",
                    select: "url thumbUrl",
                },
                {
                    path: "cover",
                    model: "File",
                    select: "url thumbUrl",
                },
                {
                    path: "salesCompsId",
                    model: "SalesComps"
                },
                {
                    path: "rentCompsId",
                    model: "RentComps"
                },
                {
                    path: "rentEstimateId",
                    model: "RentEstimateComps"
                },
                {
                    path: "ownerProfile",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                }
            ],
        })
        .populate({
            path: "participants",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName wallet",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        });

    let allTeams = [...accessableOrgs, ...projectTeams];
    let restructuredAllTeams = [];

    allTeams.map(team => {
        let participantIds = [];
        let participants = team.participants;

        participants.map(participant => {
            participantIds.push(participant._id);
        });

        const restructuredTeam = {
            ...team._doc,
            participants: participantIds,
            populatedParticipants: participants,
        };

        restructuredAllTeams.push(restructuredTeam);
    });

    res.json({
        status: 200,
        teams: restructuredAllTeams,
    });
};

const getUserOrgTeams = (req, res) => {
    Team.find({
        participants: { $in: [req.body.profile] },
        parentModelName: "Organization",
    })
        .populate({
            path: "parent",
            populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
        })
        .then(teams => {
            res.json({
                status: 200,
                data: teams,
            });
        });
};

/**
 *
 * @param { Object } req.body
 * @param { Array } req.body.participants
 * @param {*} res
 */

const addParticipants = (req, res) => {
    const newParticipants = req.body.participants;

    const teamId = req.body.team;

    Team.findById(teamId).then(team => {
        team.participants = _.union(team.participants, newParticipants);
        newParticipants.map(pId => {
            var permissionPath = "permissions." + pId;

            team.set(permissionPath, "Editor");
        });

        team.save().then(team => {
            Team.findById(teamId).then(team => {
                res.json(team);
            });
        });
    });
};

const removeParticipants = (req, res) => {
    const outParticipants = req.body.participants;
    const teamId = req.body.team;

    Team.findById(teamId).then(team => {
        var oldTeamParticipants = JSON.parse(JSON.stringify(team.participants));
        var participantsOut = JSON.parse(JSON.stringify(outParticipants));

        team.participants = _.pullAll(oldTeamParticipants, participantsOut);

        team.save().then(team => {
            Team.findById(teamId)
                .populate([
                    {
                        path: "allTimeMembers.modelId",
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ])
                .then(team => {
                    res.json(team);
                });
        });
    });
};

const changeMemberRole = (req, res) => {
    const memberId = req.body.member;
    const teamId = req.body.team;
    const role = req.body.role;

    Team.findById(teamId).then(team => {
        var permissionPath = "permissions." + memberId;

        team.set(permissionPath, role);

        team.save().then(team => {
            res.json(team);
        });
    });
};

const getTopProjects = async (req, res) => {
    try {
        const adminProfiles = req.body.adminProfiles;
        const teams = await Team.find({
            participants: { $in: adminProfiles },
            parentModelName: "Project",
            ancestors: { $size: 0 },
        })
            .populate({
                path: "parent",
                select: "displayName displayPicture",
                populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
            })
            .populate({
                path: "parent",
                populate: {
                    path: "salesCompsId",
                    model: "SalesComps",
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "rentCompsId",
                    model: "RentComps",
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "rentEstimateId",
                    model: "RentEstimateComps",
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "ownerProfile",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    }
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Rental",
                        model: "PurchaseCriteria",
                    }
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "BRRRR",
                        model: "PurchaseCriteria",
                    }
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Flip",
                        model: "PurchaseCriteria",
                    }
                }
            })

        res.json({
            status: 200,
            data: teams,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getTeamsWithAdminOwnerPermisson = async (req, res) => {
    //
    try {
        const profileId = req.body.profileId;
        console.log({ profileId });
        // const query = {$or: [{[`permissions.${profileId}`]: "Admin"}, {[`permissions.${profileId}`]: "Owner"}]};
        const adminOwnerPermissionTeam = await Team.find({
            $and: [
                { participants: { $elemMatch: { $eq: profileId } } },
                { parentModelName: "Organization" },
                { $or: [{ [`permissions.${profileId}`]: "Admin" }, { [`permissions.${profileId}`]: "Owner" }] },
            ],
        }).populate("parent");
        //students:{$elemMatch:{$eq:ObjectId("51780f796ec4051a536015cf")}}

        console.log(adminOwnerPermissionTeam);
        res.status(200).json({
            data: adminOwnerPermissionTeam,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Something Went Wrong",
        });
    }
};

module.exports = {
    getProfiles,
    setTeam,
    teamBasicData,
    teamData,
    getDeepTeams,
    getUserTeams,
    getUserOrgTeams,
    addParticipants,
    removeParticipants,
    changeMemberRole,
    getTopProjects,
    getTeamsWithAdminOwnerPermisson,
};
