const Team = require("../models/team.model");
const Invite = require("../models/invite.model");
var _ = require("../helpers/array.utils");
const sendEmail = require("../services/sendInviteEmail");
const async = require("async");
const email = require("../services/invite.email");
const { findById } = require("../models/team.model");
const keys = require("../keys/keys")

const getInvitation = (req, res) => {
    var inviteId = req.body.inviteId;
    Invite.findById(inviteId)
        .populate([
            {
                path: "invitedById",
                select: "displayName model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
            {
                path: "team",
                populate: {
                    path: "parent",
                    populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
                },
            },
        ])
        .then(invite => {
            res.json(invite);
        });
};

const updateInvite = (req, res) => {
    var inviteObject = req.body;
    var inviteId = inviteObject._id;

    Invite.findByIdAndUpdate(inviteId, inviteObject, { new: true }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            Invite.findById(inviteId)
                .populate([
                    {
                        path: "invitedById",
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
                    },
                    {
                        path: "team",
                        populate: {
                            path: "parent",
                            populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
                        },
                    },
                ])
                .then(invite => {
                    res.json(invite);
                });
        }
    });
};

const sendInviteEmails = invites => {
    async.map(
        invites,
        function (invite, callback) {
            var inviteId = invite._id;
            // Invite.findById(inviteId)
            //     .populate([
            //         {
            //             path: "invitee",
            //             model: "Profile",
            //             select: "parent parentModelName",
            //             populate: {
            //                 path: "parent",
            //                 select: "name displayName wallet",
            //                 populate: {
            //                     path: "displayPicture",
            //                     model: "File",
            //                     select: "url thumbUrl",
            //                 },
            //             },
            //         },
            //         {
            //             path: "invitedById",
            //             model: "Profile",
            //             select: "parent parentModelName",
            //             populate: {
            //                 path: "parent",
            //                 select: "name displayName wallet",
            //                 populate: {
            //                     path: "displayPicture",
            //                     model: "File",
            //                     select: "url thumbUrl",
            //                 },
            //             },
            //         },

            //         {
            //             path: "team",
            //             populate: {
            //                 path: "parent",
            //                 populate: [{path: "displayPicture", model: "File", select: "url thumbUrl"}],
            //             },
            //         },
            //     ])
            var { invitedById, team, role } = invite;
            var { displayName, displayPicture } = invitedById.parent;

            var { displayName: teamName, displayPicture: teamDp } = team.parent;

            var parentModelName = team.parentModelName;

            var emails = [];

            if (invite.email) {
                emails.push(invite.email);
            }

            if (invite.invitee && invite.invitee._id) {
                console.log(invite.invitee);
                var email = invite.invitee.email || invite.invitee.parent.email;
                if (email) emails.push(email);
            }

            var text = ` ${displayName} invited you to join ${teamName} ${parentModelName} as a ${role}. Click here to accept invite`;
            //Change_Later
            var link = keys.INVITE_EMAIL_BASE + invite._id;
            // var link = "http://" + parentModelName + "/" + parentId;
            var linkText = "Accept Invitation";
            console.log(text, link, linkText, email);
            var sendEmailFn = async function (email, callback) {
                try {
                    var info = await sendEmail({
                        text,
                        link,
                        linkText,
                        email,
                    });
                    callback(null, info);
                } catch (error) {
                    callback(error);
                }
            };

            async.map(emails, sendEmailFn, function (err, results) {
                // results now equals an array of the existing files
            });
        },
        function (err, results) {
            // results now equals an array of the existing files
        }
    );
};

const getUserInvites = (req, res) => {
    const userId = req.body.user;
    const teamType = req.body.teamType;

    const findObj = {
        invitee: { $in: userId },
        deleted: false,
        status: false,
    };

    if (teamType) findObj.teamType = teamType;

    Invite.find(findObj)
        .populate([
            {
                path: "invitedById",
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
            },
            {
                path: "team",
                populate: {
                    path: "parent",
                    populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
                },
            },
        ])
        .then(invitations => {
            res.json({
                invitations,
            });
        });
};

const getTeamInvites = (req, res) => {
    const teamId = req.body.team;

    Invite.find({ team: teamId, deleted: false, status: false })
        .populate([
            {
                path: "invitee",
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
            },
            {
                path: "invitedById",
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
            },
        ])
        .then(invites => {
            res.json({
                invites,
            });
        });
};

const inviteTeam = async (req, res) => {
    try {
        const invitesDoc = req.body.invites;
        let invites = await Invite.insertMany(invitesDoc);
        invites = await Invite.populate(invites, [
            {
                path: "invitee",
                model: "Profile",
                select: "parent parentModelName email",
                populate: {
                    path: "parent",
                    select: "name displayName wallet email",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            },
            {
                path: "invitedById",
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
            },

            {
                path: "team",
                populate: {
                    path: "parent",
                    populate: [{ path: "displayPicture", model: "File", select: "url thumbUrl" }],
                },
            },
        ]);
        // console.log(invites);
        sendInviteEmails(invites);

        res.status(200).json({
            result: invites,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({ error: "Something Went Wrong" });
    }
    // async.map(
    //     invites,
    //     function (invite, callback) {
    //         var invite = new Invite(invite);

    //         invite
    //             .save()
    //             .then(invite => {
    //                 Invite.findById(invite._id)
    //                     .populate([
    //                         {
    //                             path: "invitee",
    //                             model: "Profile",
    //                             select: "parent parentModelName",
    //                             populate: {
    //                                 path: "parent",
    //                                 select: "name displayName wallet",
    //                                 populate: {
    //                                     path: "displayPicture",
    //                                     model: "File",
    //                                     select: "url thumbUrl",
    //                                 },
    //                             },
    //                         },
    //                         {
    //                             path: "invitedById",
    //                             model: "Profile",
    //                             select: "parent parentModelName",
    //                             populate: {
    //                                 path: "parent",
    //                                 select: "name displayName wallet",
    //                                 populate: {
    //                                     path: "displayPicture",
    //                                     model: "File",
    //                                     select: "url thumbUrl",
    //                                 },
    //                             },
    //                         },
    //                     ])
    //                     .then(invite => {
    //                         callback(null, invite);
    //                     });
    //             })
    //             .catch(err => {
    //                 console.log(err, " is the err");
    //                 callback(err);
    //             });
    //     },
    //     function (err, results) {
    //         sendInviteEmails(results);

    //         res.json({
    //             status: "200",
    //             result: results,
    //         });
    //     }
    // );
};

const onInviteAccept = (req, res) => {
    var inviteId = req.body.invite;
    var userProfile = req.body.profile;

    Invite.findByIdAndUpdate(inviteId, { status: true }, { new: true })
        .then(newInvite => {
            console.log(newInvite);
            Invite.findById(inviteId)
                .populate("invitee")
                .then(async (invite) => {
                    var teamId = invite.team;
                    var inviteeId = invite?.invitee?._id || userProfile;
                    var permissionPath = "permissions." + inviteeId;

                    var updateObj = {
                        $addToSet: { participants: inviteeId },
                        $set: { [permissionPath]: invite.role },
                        status: true,
                    };

                    if (!invite.invitee) updateObj.invitee = userProfile;

                    await Team.findByIdAndUpdate(teamId, updateObj, { new: true })
                        .populate({
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            }
                        })
                        .populate({
                            path: "parent",
                            populate: {
                                path: "basic",
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
                                },
                            }
                        })
                        .populate({
                            path: "allTimeMembers.modelId",
                            select: "name displayName wallet model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
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
                        })
                        .populate({
                            path: "parent",
                            populate: [
                                {
                                    path: "project",
                                    model: "Project",
                                    populate: {
                                        path: "displayPicture",
                                        model: "File",
                                        select: "url thumbUrl",
                                    },
                                },
                            ],
                        })
                        .then(team => {
                            let participantIds = []
                            let participants = team.participants

                            participants.map((participant) => {
                                participantIds.push(participant._id)
                            })

                            const reStructuredTeam = {
                                ...team._doc,
                                participants: participantIds,
                                populatedParticipants: participants
                            }

                            res.json(reStructuredTeam);
                        })
                        .catch(err => res.json(err));
                });
        })
        .catch(err => res.json(err));
};

const onInviteReject = (req, res) => {
    var inviteId = req.body.invite;
    Invite.findByIdAndUpdate(inviteId, { deleted: true }).then(result => {
        res.json({ status: 200 });
    });
};

const getSentInvites = async (req, res) => {
    try {
        const invitedById = req.body.invitedById;
        const teamType = req.body.teamType;
        const invites = await Invite.find({ invitedById: { $in: invitedById }, teamType, deleted: false, status: false })
            .populate([
                {
                    path: "invitee",
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
                },
                {
                    path: "invitedById",
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
                },
            ])
            .populate("team");
        res.status(200).json({
            data: invites,
        });
    } catch (error) {
        res.status(400).json({
            error,
        });
    }
};

module.exports = {
    getInvitation,
    updateInvite,
    getUserInvites,
    getTeamInvites,
    inviteTeam,
    onInviteAccept,
    onInviteReject,
    getSentInvites,
};
