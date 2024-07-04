const Team = require("../models/team.model");
const User = require("../models/user.model");
const Organization = require("../models/organization.model");
const Project = require("../models/project.model");
const Profile = require("../models/profile.model");

const getAssignableProfiles = async (req, res) => {
    try {
        const shared = req.body.shared;

        const profiles = await Profile.find({_id: {$in: shared}})
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "parent parentModelName displayName displayPicture profile",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "parent",
                select: "displayName displayPicture profile team",
                populate: {
                    path: "team",
                    select: "participants",
                    populate: {
                        path: "participants",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "displayName displayPicture profile parentModelName",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                },
            });

        res.status(200).json({
            data: profiles,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getUserData = async (req, res) => {
    var name = new RegExp(req.body.name, "ig");
    try {
        const users = await User.find({
            displayName: name,
        })
            .limit(20)
            .select("name displayName displayPicture profile")
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            });

        res.status(200).send({
            data: users,
        });
    } catch (error) {
        res.status(400).send({
            data: null,
            error,
        });
    }
};

const getMoreProjects = async (req, res) => {
    try {
        const adminProfileIds = req.body.adminProfileIds;

        const projectTeams = await Team.find({
            participants: {$in: adminProfileIds},
            parentModelName: "Project",
            ancestors: {$size: 0},
        })
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "name displayName profile displayPicture address",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

        res.status(200).send({
            data: projectTeams,
        });
    } catch (error) {
        console.log(error, " is the error");
        res.status(400).send({
            data: null,
            error,
        });
    }
};

const getAdminProfilesAndData = async (req, res) => {
    try {
        const userProfileId = req.body.userProfileId;

        const adminProfileSet = new Set([userProfileId]);
        let adminProfileIds = [userProfileId];

        const orgTeams = await Team.find({
            participants: {$in: adminProfileIds},
            parentModelName: "Organization",
        })
            .select("parent parentModelName participants permissions")
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture wallet",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

        orgTeams.map(team => {
            const perm = JSON.parse(JSON.stringify(team.permissions));

            const role = perm[userProfileId];
            const orgProfileId = team.parent.profile;

            if (role == "Admin" || role == "Owner") {
                if (orgProfileId) {
                    adminProfileSet.add(orgProfileId);
                }
            }
        });

        adminProfileIds = Array.from(adminProfileSet);

        const projectTeams = await Team.find({
            participants: {$in: adminProfileIds},
            parentModelName: "Project",
        })
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address wallet",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

        res.status(200).json({
            data: {
                adminProfileIds,
                orgTeams,
                projectTeams,
            },
        });
    } catch (error) {
        console.log(error, " is the error");
        res.status(400).json({
            data: null,
            error,
        });
    }
};

// const deleteSubProject = async () => {
//     const subTeams  = await Team.find({
//         $or: [
//             {
//                 'ancestors.0': {$exists: true}
//             },

//             {
//                 profile: {$exists: false}
//             }
//         ],

//         parentModelName:'Project'
//     }).select('parent parentModelName ancestors')
//     .populate({ path : 'parent', select:'name displayName profile'})

//     const teamIds = subTeams.map(team=>team._id)
//     const projectIds = subTeams.map(team=>team.parent._id)

//     const projects = await Project.find({_id: {$in: projectIds}}).select('displayName')
//     await Team.deleteMany({
//         _id: {$in: teamIds}
//     })
//     await Project.deleteMany({
//         _id: {$in: projectIds}
//     })

//     console.log(teamIds.length,projectIds.length,projects.length,subTeams.length, ' is the subTeams')
// }

module.exports = {
    getAssignableProfiles,
    getAdminProfilesAndData,
    getMoreProjects,
    getUserData,
    // deleteSubProject
};
