const JoinModerators = require("../models/joinModerators.model");
const Community = require("../models/community.model");
const Profile = require("../models/profile.model");
const convertStringArrayToObjectArray = require("../helpers/convertStringArrayToObjectIdArray");
const mongoose = require("mongoose");

const createJoin = async (req, res) => {
    try {
        const {user, profile, community, communityProfile, invitedProfile} = req.body;

        const profileObj = await Profile.findById(invitedProfile);
        // console.log("communityObj", communityObj);
        if (!profileObj) throw new Error("Community not found");

        const join = await JoinModerators.find({invitedProfile, communityProfile});
        // console.log("join", join);
        if (join.length > 0) {
            await JoinModerators.findByIdAndDelete(join[0]._id);
            // const communityDoc = await Community.findById(join.community);

            return res.status(200).json({
                join: null,
            });
        }

        let joinObj = new Join({
            user,
            profile,
            community,
            communityProfile,
            invitedProfile,
            status: "new",
        });
        joinObj = await joinObj.save();

        await joinObj
            .populate({
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
                path: "communityProfile",
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
                path: "community",
                populate: [
                    {
                        path: "userProfile",
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
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })
            .populate({
                path: "invitedProfile",
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
            .execPopulate();

        res.status(201).json({
            join: joinObj,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

const deleteJoin = async (req, res) => {
    try {
        const id = req.body._id;
        const join = await JoinModerators.findByIdAndDelete(id);
        // console.log(newComm);
        res.status(200).json({
            join: null,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

const onAccept = async (req, res) => {
    const joinId = req.body._id;

    const join = await JoinModerators.findByIdAndUpdate(joinId, {status: "accepted"}, {new: true})
        .populate({
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
            path: "communityProfile",
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
            path: "community",
            populate: [
                {
                    path: "userProfile",
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
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            ],
        })
        .populate({
            path: "invitedProfile",
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
    const community = await findByIdAndUpdate(join?.community?._id, {
        $addToSet: {moderators: join?.invitedProfile?._id},
    });

    res.status(200).json({
        join,
        community,
    });
};

module.exports = {
    createJoin,
    deleteJoin,
    onAccept,
};
