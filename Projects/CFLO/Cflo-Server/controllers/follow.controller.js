const Follow = require("../models/follow.model");
const Profile = require("../models/profile.model");

const follow = async (req, res) => {
    try {
        const profile = req.body.profile;
        const userProfile = req.body.userProfile;
        let profileObj = await Profile.findById(req.body.profile);
        let userProfileObj = await Profile.findById(req.body.userProfile);
        if (!profileObj?._id || !userProfileObj?._id) throw new Error("profile or userProfile Not found");

        let follow = await Follow.find({profile: req.body.profile, userProfile: req.body.userProfile});

        if (follow.length > 0) {
            //unfollow
            profileObj = await Profile.findByIdAndUpdate(
                profile,
                {
                    followerCount:
                        profileObj?.followerCount && profileObj?.followerCount > 0 ? profileObj?.followerCount - 1 : 0,
                },
                {new: true}
            );

            userProfileObj = await Profile.findByIdAndUpdate(
                userProfile,
                {
                    followingCount:
                        userProfileObj?.followingCount && userProfileObj?.followingCount > 0
                            ? userProfileObj?.followingCount - 1
                            : 0,
                },
                {new: true}
            );

            await Follow.findByIdAndDelete(follow[0]._id);
            res.json({
                status: 200,
                data: null,
            });
        } else {
            //follow
            profileObj = await Profile.findByIdAndUpdate(
                profile,
                {
                    followerCount: (profileObj?.followerCount || 0) + 1,
                },
                {new: true}
            );

            userProfileObj = await Profile.findByIdAndUpdate(
                userProfile,
                {
                    followingCount: (userProfileObj?.followingCount || 0) + 1,
                },
                {new: true}
            );
            follow = new Follow(req.body);
            follow = await follow.save();
            follow = await Follow.findById(follow._id)
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
                });

            res.json({
                status: 201,
                data: follow,
            });
        }
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            error: "Something Went Wrong",
        });
    }
};

const unfollow = async (req, res) => {
    try {
        let follow = await Follow.find({profile: req.body.profile, user: req.body.userProfile});
        if (follow.length === 0) throw new Error("Already Unfollowing");

        await Follow.findByIdAndDelete(follow[0]._id);
        res.json({
            status: 200,
            data: null,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error: "Something Went Wrong",
        });
    }
};

const getFollowers = async (req, res) => {
    try {
        const profile = req.body.profile;
        const followers = await Follow.find({profile: profile})
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
            })
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
            });
        res.status(200).json({
            data: followers,
        });
    } catch (error) {
        res.status(400).json({
            error: "Cannot get followers",
        });
    }
};

const getFollowing = async (req, res) => {
    try {
        const userProfile = req.body.userProfile;
        const following = await Follow.find({userProfile})
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
            });
        res.status(200).json({
            data: following,
        });
    } catch (error) {
        res.status(400).json({
            error: "Cannot get following",
        });
    }
};

const isFollowing = async (req, res) => {
    try {
        let follow = await Follow.find({profile: req.body.profile, userProfile: req.body.userProfile});
        let following = true;
        if (follow.length === 0) following = false;
        res.status(200).json({
            data: following,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};

module.exports = {
    follow,
    unfollow,
    getFollowers,
    getFollowing,
    isFollowing,
};
