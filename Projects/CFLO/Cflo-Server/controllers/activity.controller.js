const Activity = require("../models/activity.model");
const User = require("./user.controller");
var async = require("async");
const socketApi = require("../services/socket");
const teamProjectSocket = require("../services/team.project.socket");
const {createNotification} = require("./notification.controller");
const Profile = require("../models/profile.model");
const Organization = require("../models/organization.model");
const Project = require("../models/project.model");
const Team = require("../models/team.model");
const mongoose = require("mongoose");

const models = {
    Organization,
    Project,
};

const setActivities = (req,res) => {
    const {data,dataModel,user,profile}=req.body;
    Activity.find({data,dataModel})
        .populate("user", "profile")
        .then(activities => {
            console.log(activities);
            async.map(
                activities,
                function (activity, callback) {
                    // var profileId = activity.user.profile;
                    var activityId = activity._id;
                    var activityObject = {
                        _id: activityId,
                        // profile: profileId,
                        title:`${user?.displayName} updated a document`,
                        user,
                        profile,
                    };

                    Activity.findByIdAndUpdate(activityId, activityObject, {new: true}, function (err, resp) {
                        if (err) {
                            console.log(err);
                        } else {
                        }
                    });
                },
                function (er, users) {}
            );
            res.status(200).json({
                data:activities,
        })
        });
};

const getUserNotifications = (req, res) => {
    Activity.find({
        $and: [
            {user: {$ne: req.body.user}},
            {
                $or: [
                    {
                        parentModelName: "Team",
                        parent: {$in: req.body.teamIds},
                    },
                ],
            },
        ],
    })
        .sort("-createdAt")
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
            populate: {
                path: "parent",
                select: "name displayName wallet model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .then(activities => {
            res.json(activities);
        });
};

// Activity is called as a side product of every action on platform

const create = async (req, activityObject, notifyProfileIds = [], userProfileId) => {
    try {
        let activity = new Activity(activityObject);
        activity = await activity.save();
        activity = await Activity.findById(activity._id)
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "data",
                populate: [
                    {
                        path: "profile",
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
                        path: "user",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "parent",
                populate: [
                    {
                        path: "profile",
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
                        path: "user",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "notify",
                populate: {
                    path: "parent",
                },
            });

        const newNotifiactionProfiles = [];

        const populatedNotify = activity?.notify || [];
        // console.log("populated Notify", populatedNotify);
        await Promise.all(
            populatedNotify.map(async obj => {
                //If parent is team, send notification to all of it's, admin, owner and members(if only admin is false).
                if (
                    obj?.parentModelName === "Team" ||
                    obj?.parentModelName === "Organization" ||
                    obj?.parentModelName === "Project"
                ) {
                    // const team = await Team.findById(obj?.parent);
                    let permissions;
                    if (obj?.parentModelName === "Team") permissions = obj?.parent?.permissions || {};
                    else {
                        const teamObj = await Team.findById(obj?.parent?.team);
                        permissions = teamObj?.permissions;
                    }

                    const permissionMapArray = Array.from(permissions);
                    permissionMapArray.forEach(el => {
                        const id = el[0],
                            value = el[1];
                        // console.log("(", id, value, ")");
                        if (activity?.adminOnly === false || value === "Owner" || value === "Admin")
                            newNotifiactionProfiles.push(id);
                    });
                }

                //If parent is community then send notifications to all of the moderator.
                // console.log("moderators", obj?.parent);
                if (obj?.parentModelName == "Community") {
                    const communityModerators = obj?.parent?.moderators;
                    newNotifiactionProfiles.push(...(communityModerators || []));
                }
            })
        );

        //For activity parent, fetch it's admins
        if (
            activity?.parentModelName === "Team" ||
            activity?.parentModelName === "Organization" ||
            activity?.parentModelName === "Project"
        ) {
            // const team = await Team.findById(activity?.parent);
            let permissions;
            if (activity?.parentModelName === "Team") permissions = activity?.parent?.permissions || {};
            else {
                const teamObj = await Team.findById(activity?.parent?.team);
                permissions = teamObj?.permissions;
            }

            const permissionMapArray = Array.from(permissions);
            permissionMapArray.forEach(el => {
                const id = el[0],
                    value = el[1];
                if (activity?.adminOnly === false || value === "Owner" || value === "Admin")
                    newNotifiactionProfiles.push(id);
            });
        }

        //If parent is community then send notifications to all of the moderator.
        // console.log("moderators", activity?.parent);
        if (activity?.parentModelName == "Community") {
            const communityModerators = activity?.parent?.moderators;
            newNotifiactionProfiles.push(...(communityModerators || []));
        }

        var profileId = activity?.profile?._id;
        let finalNotificationProfileArr = [
            ...(Array.isArray(notifyProfileIds) ? notifyProfileIds : []),
            ...newNotifiactionProfiles,
        ];
        finalNotificationProfileArr = [...new Set(finalNotificationProfileArr)];
        finalNotificationProfileArr = finalNotificationProfileArr.filter(id => String(id) !== String(userProfileId));
        // console.log("activity", activity);
        console.log("finalActivityProfileArray", finalNotificationProfileArr);
        console.log("initial notification array", notifyProfileIds);
        console.log("final notificaltion array", finalNotificationProfileArr);
        const notificationBody = {
            activity: activity?._id,
            notificationProfiles: finalNotificationProfileArr,
        };
        createNotification(notificationBody);
        socketApi(req, finalNotificationProfileArr, {
            type: "Activity",
            payload: activity,
        });
        // res.json(activity);
        // console.log("activity",activity);
        // return activity;
    } catch (err) {
        console.log(err);
        // res.status(400).json({
        //     error: "Something went wrong",
        // });
    }
};

const getMyActivity = (req, res) => {
    var userId = req.body.userId;

    Activity.find({
        user: userId,
    })
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
            populate: {
                path: "parent",
                select: "name displayName wallet model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .then(activities => {
            res.json(activities);
        })
        .catch(err => {});
};

const getTeamActivities = (req, res) => {
    var teamIds = req.body.teamIds;

    Activity.find({
        parent: {$in: teamIds},
    })
        .sort("-createdAt")
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
            populate: {
                path: "parent",
                select: "name displayName wallet model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .then(activities => {
            res.json(activities);
        })
        .catch(err => {
            console.log("error is ", err);
        });
};

// const getPlatform = (req, res)=>{

//     var parents = req.body.parents;

//     var parentDic = {}
//     var parentIds = []

//     parents.map(parent=>{
//         var parentId = parent._id;
//         var type = parent.type;
//         parentIds.push(parentId);
//         var parentTypes = parentDic[parentId];
//         if(parentTypes&&parentTypes.length>0){
//             parentTypes.push(type);
//             parentDic[parentId] = parentTypes;
//         }else{
//             parentDic[parentId] = [ type ]
//         }
//     })

//     Activity.find({
//         $or:[
//             {parent:{$in : parentIds}},
//             { "notify.entity":{$in : parentIds}}
//         ]
//     }).then(activities=>{
//         var validActivities = activities.filter(activity=>{
//             var type = activity.parentModelName;
//             var parentId = activity.parent;
//             var types = parentDic[parentId];

//             if(types.indexOf(type)==-1){
//                 return false;
//             }else{
//                 return true
//             }
//         })

//         console.log(activites, validActivities);
//         res.json(validActivities)

//     })

// }

// const getActivities = (req, res) => {
//     const activities = req.body.activities;
//     async.map(activities, function(activityId, callback) {
//         Activity.findById(activityId)
//             .then(activity => {
//                 callback(null, activity)
//             })
//             .catch(err => {
//                 callback(err)
//             })

//     }, function(err, results) {

//         res.json({
//             status: '200',
//             result: results
//         })
//     })
// }

const getParentActivities = async (req, res) => {
    try {
        const {parent, parentModelName, page = 0, limit = 20} = req.body;
        const activities = await Activity.find({parent, parentModelName})
            .sort({createdAt: -1})
            .skip(page * limit)
            .limit(limit)
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "data",
                populate: [
                    {
                        path: "profile",
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
                        path: "user",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "parent",
                populate: [
                    {
                        path: "profile",
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
                        path: "user",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "user",
                select: "name displayName model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

        console.log("activities, ", activities);
        res.status(200).json({
            length: activities.length || 0,
            activities,
        });
    } catch (error) {
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};
const getDataModelActivites=async(req,res)=>{
    try {
        const {data,dataModel} = req.body;
        const activities = await Activity.find({data,dataModel})
            .populate({
                path: "profile",
                populate: {
                    path: "parent",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "data",
                populate: [
                    {
                        path: "profile",
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
                        path: "user",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "parent",
                populate: [
                    {
                        path: "profile",
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
                        path: "user",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "user",
                select: "name displayName model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

        console.log("activities, ", activities);
        res.status(200).json({
            length: activities.length || 0,
            data:activities,
        });
    } catch (error) {
        res.status(400).json({
            error: "Something went wrong",
        });
    }
}
module.exports = {
    getUserNotifications,
    create,
    getMyActivity,
    setActivities,
    // getActivities,
    // getPlatform,
    getTeamActivities,
    getParentActivities,
    getDataModelActivites
};
