const mongoose = require("mongoose");
const Community = require("../models/community.model");
const Profile = require("../models/profile.model");
const Follow = require("../models/follow.model");
const Join = require("../models/join.model");

const createCommunity = async (req, res) => {
    try {
        var community = new Community(req.body);
        profile = new Profile({
            parent: community._id,
            parentModelName: "Community",
        });
        await profile.save();

        community.profile = profile._id;
        community = await community.save();
        community = await Community.findById(community._id)
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
            })
            .populate({
                path: "moderators",
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
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "cover",
                model: "File",
                select: "url thumbUrl",
            });
        // console.log(community);
        res.json({
            status: 201,
            data: community,
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            error: "Something Went Wrong",
        });
    }
};

const updateCommunity = async (req, res) => {
    var {communityObject} = req.body;
    var communityId = communityObject._id;
    try {
        const community = await Community.findByIdAndUpdate(communityId, communityObject, {new: true})
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "cover",
                model: "File",
                select: "url thumbUrl",
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
                path: "moderators",
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
        console.log("coms", communityId, communityObject);
        res.json({
            status: 200,
            data: community,
        });
    } catch (err) {
        console.log("error update community", err);
        res.json({
            status: 400,
            data: null,
            error: `Something Went Wrong: ${err}`,
        });
    }
};

const getCommunity = async (req, res) => {
    try {
        const communityId = req.body._id;
        const userProfile = req.body.profile;

        // if (!userProfile) throw new Error("user profile not found in request");

        const community = await Community.findById(communityId)
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
            .populate({path: "displayPicture", model: "File", select: "url thumbUrl"})
            .populate({path: "cover", model: "File", select: "url thumbUrl"})
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
                path: "moderators",
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
        const join = await Join.find({communityProfile: community.profile, userProfile});
        let joinRes;

        if (join.length === 0) joinRes = null;
        else joinRes = join[0];

        const members = await Join.find({communityProfile: community.profile, status: "accepted"})
            .select({profile: 1})
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

        res.json({
            status: 200,
            join: joinRes,
            data: community,
            members,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            error: error,
        });
    }
};

const deleteCommunity = async (req, res) => {
    const communityId = req.body._id;
    try {
        const community = await Community.findByIdAndDelete(communityId);
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

const addModerator = async (req, res) => {
    try {
        const moderator = req.body.moderator;
        const communityId = req.body._id;
        const userProfile = req.body.userProfile;

        if (!moderator || !communityId) throw new Error("Please provide all parameters in request");
        let community = await Community.findById(communityId);

        if (!community) throw new Error("No community Found");

        if (!community.moderators.includes(userProfile)) throw new Error("Permission Denied");

        if (!community.moderators.includes(moderator)) {
            community = await Community.findByIdAndUpdate(communityId, {$push: {moderators: moderator}}, {new: true});
        }

        community = await community
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
            })
            .populate({
                path: "moderators",
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
            .populate({path: "displayPicture", model: "File", select: "url thumbUrl"})
            .populate({path: "cover", model: "File", select: "url thumbUrl"})
            .execPopulate();

        res.status(200).json({
            data: community,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error.message,
        });
    }
};

const removeModerator = async (req, res) => {
    try {
        const moderator = req.body.moderator;
        const communityId = req.body._id;
        const userProfile = req.body.userProfile;
        if (!moderator || !communityId) throw new Error("Please provide all parameters in request");
        let community = await Community.findById(communityId);

        if (!community) throw new Error("No community Found");

        if (!community.moderators.includes(userProfile)) throw new Error("Permission Denied");

        if (community.moderators.includes(moderator)) {
            community = await Community.findByIdAndUpdate(communityId, {$pull: {moderators: moderator}}, {new: true});
        }

        community = await community
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
            })
            .populate({
                path: "moderators",
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
            .populate({path: "displayPicture", model: "File", select: "url thumbUrl"})
            .populate({path: "cover", model: "File", select: "url thumbUrl"})
            .execPopulate();

        res.status(200).json({
            data: community,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error.message,
        });
    }
};

const getCommunityMembers = async (req, res) => {
    try {
        const communityProfile = req.body.communityProfile;
        const join = await Join.find({communityProfile, status: "accepted"})
            .select({
                // user: 1,
                profile: 1,
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
        // console.log("getCommunityMembers", join);
        res.status(200).json({
            communityMembers: join,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

const getJoinedCommunities = async (req, res) => {
    try {
        const profile = req.body.profile;
        const community = await Join.find({profile, status: "accepted"})
            .select({community: 1})
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
                    {path: "displayPicture", model: "File", select: "url thumbUrl"},
                    {path: "cover", model: "File", select: "url thumbUrl"},
                    {
                        path: "moderators",
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
                ],
            });

        res.status(200).json({
            communities: community,
        });
    } catch (err) {
        console.log(err);
        res.status(200).json({
            error: "Something Went Wrong",
        });
    }
};

const getUsersModerationCommunities = async (req, res) => {
    //Get all of the communities where user is a moderator
    try {
        const profile = req.body.profile;

        const communities = await Community.find({moderators: profile})
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
            .populate({path: "displayPicture", model: "File", select: "url thumbUrl"})
            .populate({path: "cover", model: "File", select: "url thumbUrl"})
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
                path: "moderators",
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
            communities,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};

const getTopSuggestedCommunities = async (req, res) => {
    try {
        const {profile, page = 0, limit = 20} = req.body;

        let communities = await Community.aggregate([
            // {
            //     $match: {
            //         // profile: {$ne: mongoose.Types.ObjectId(profile)},
            //     },
            // },
            {
                $lookup: {
                    from: "joins",
                    localField: "_id",
                    foreignField: "community",
                    as: "join",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(profile)},
                        },
                    ],
                },
            },
            {
                $match: {$expr: {$eq: [{$size: "$join"}, 0]}},
            },
            {
                //sort by latest first
                $sort: {joinCount: -1},
            },
            {
                //pagination step 1
                $limit: page * limit + limit,
            },
            {
                //pagination step 2
                $skip: page * limit,
            },
        ]);

        communities = await Community.populate(communities, [
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
            {path: "displayPicture", model: "File", select: "url thumbUrl"},
            {path: "cover", model: "File", select: "url thumbUrl"},
            {
                path: "moderators",
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
        ]);

        res.status(200).json({
            communities,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};

const searchCommunityList = async (req, res) => {
    try {
        const name = new RegExp(req.body.name, "ig");
        const limit = req.body.limit || 20;

        const commmunities = await Community.find({
            displayName: name,
        })
            .sort({joinCount: -1})
            .limit(limit)
            .populate({path: "displayPicture", model: "File", select: "url thumbUrl"})
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
            });

        res.json({
            status: 200,
            data: commmunities,
        });
    } catch (error) {
        console.log(error, " is the error");
        res.json({
            status: 200,
            data: null,
            error,
        });
    }
};

module.exports = {
    createCommunity,
    updateCommunity,
    getCommunity,
    deleteCommunity,
    addModerator,
    removeModerator,
    getCommunityMembers,
    getJoinedCommunities,
    getUsersModerationCommunities,
    getTopSuggestedCommunities,
    searchCommunityList,
};
