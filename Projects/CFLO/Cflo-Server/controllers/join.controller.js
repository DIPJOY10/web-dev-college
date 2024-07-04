const Join = require("../models/join.model");
const Community = require("../models/community.model");
// const {findById} = require("../models/community.model");
const convertStringArrayToObjectArray = require("../helpers/convertStringArrayToObjectIdArray");
const mongoose = require("mongoose");

const createJoin = async (req, res) => {
    try {
        const {user, profile, community, communityProfile} = req.body;

        const communityObj = await Community.findById(community);
        // console.log("communityObj", communityObj);
        if (!communityObj) throw new Error("Community not found");

        const join = await Join.find({communityProfile, profile});
        // console.log("join", join);
        if (join.length > 0) {
            await Join.findByIdAndDelete(join[0]._id);
            // const communityDoc = await Community.findById(join.community);
            const updatedCommunity = await Community.findByIdAndUpdate(
                communityObj?._id,
                {
                    joinCount: (communityObj?.joinCount || 0) - 1,
                },
                {new: true}
            );

            return res.status(200).json({
                join: null,
            });
        }

        let joinObj = new Join({
            user,
            profile,
            community,
            communityProfile,
            status: communityObj?.communityType === "public" ? "accepted" : "new",
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
            .execPopulate();

        const communityDoc = await Community.findById(community);
        await Community.findByIdAndUpdate(communityDoc?._id, {
            joinCount: (communityDoc?.joinCount || 0) + 1,
        });

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
        const join = await Join.findByIdAndDelete(id);
        const communityDoc = await Community.findById(join.community);
        const newComm = await Community.findByIdAndUpdate(
            communityDoc?._id,
            {
                joinCount: (communityDoc?.joinCount || 0) - 1,
            },
            {new: true}
        );
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

const updateProgress = async (req, res) => {
    try {
        const joinIds = req.body.joinIds;
        const joinObjectIds = await convertStringArrayToObjectArray(joinIds);
        const joins = await Join.updateMany({_id: {$in: joinObjectIds}, status: "new"}, {$set: {status: "progress"}});
        res.status(200).json({
            joins,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

const isJoined = async (req, res) => {
    try {
        const {profile, communityProfile} = req.body;

        const join = await Join.find({
            communityProfile,
            profile,
        });
        console.log("join", {communityProfile, profile}, join);
        res.status(200).json({
            isJoined: join.length > 0 && join[0]?.status === "accepted",
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

const getCommunityJoins = async (req, res) => {
    try {
        const {communityProfile} = req.body;
        const queryObj = {communityProfile, status: {$ne: "rejected"}};
        if (req?.body?.status) queryObj.status = req?.body?.status;
        const joins = await Join.find(queryObj)
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
            });
        res.status(200).json({
            joins,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

const updateJoin = async (req, res) => {
    try {
        const joinId = req.body?._id;
        if (!joinId) throw new Error("join id not found in request");

        const join = await Join.findByIdAndUpdate(joinId, req.body, {new: true})
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
            });
        res.status(200).json({
            join,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

module.exports = {
    createJoin,
    deleteJoin,
    isJoined,
    getCommunityJoins,
    updateJoin,
    updateProgress,
};
