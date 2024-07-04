const User = require("../models/user.model");
const Organization = require("../models/organization.model");
const Profile = require("../models/profile.model");
const async = require("async");
const ObjectId = require("mongoose").Types.ObjectId;

const createAndSetForUser = async (req, res) => {
    var userId = req.body.user;
    var user = await User.findById(userId);
    var profile = new Profile({
        parent: user._id,
        parentModelName: "User",
    });
    await profile.save();
    user.profile = profile._id;
    await user.save();
    res.json(profile);
};

const get = async (req, res) => {
    const profileIds = req.body.profileIds;
    async.map(
        profileIds,
        function (profileId, callback) {
            Profile.findById(profileId)
                .populate({
                    path: "parent",
                    select: "displayName displayPicture profile",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })

                .then(profile => {
                    callback(null, profile);
                });
        },
        function (err, results) {
            res.json(results);
        }
    );
};

const getProfile = async (req, res) => {
    const profileId = req.body.profileId;

    try {
        if (ObjectId.isValid(profileId)) {
            const profile = await Profile.findById(profileId)
                .select("parent parentModelName")
                .populate({
                    path: "parent",
                    select: "parent parentModelName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "parent",
                    select: "displayName displayPicture team",
                    populate: {
                        path: "team",
                        select: "participants",
                        populate: {
                            path: "participants",
                            select: "parent parentModelName",
                            populate: {
                                path: "parent",
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
                data: profile,
            });
        } else {
            res.status(200).json({
                data: [],
            });
        }
    } catch (error) {
        res.status(200).json({
            data: [],
        });
    }
};

const getProfiles = async (req, res) => {
    const profileIds = req.body.profileIds;

    try {
        if (profileIds && profileIds.length > 0) {
            const profiles = await Profile.find({_id: {$in: profileIds}}).populate({
                path: "parent",
                select: "displayName displayPicture profile parentModelName",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

            res.status(200).json({
                data: profiles,
            });
        } else {
            res.status(200).json({
                data: [],
            });
        }
    } catch (error) {
        res.status(200).json({
            data: [],
        });
    }
};

const getProfileParent = async (req, res) => {
    console.log('Backend called');
    const profileId = req.body.profileId;
    Profile.findById(profileId)
        .populate({
            path: "parent",
            populate: [
                {
                    path: "displayPicture",
                    model: "File",
                },
                {
                    path: "cover",
                    model: "File",
                },
            ],
        })
        .populate({
            path: "parent",
            populate: {
                path: "wallet",
                select: "stripeConnectAccountId defaultDwollaBankAccount",
                populate: {
                    path: "defaultDwollaBankAccount",
                    model: "DwollaBankAccount",
                    select: "url",
                },
            },
        })
        .then(profile => {
            console.log('Profile-backend')
            res.status(200).json({
                data: profile,
            });
        })
        .catch(err => {
            res.status(500).json({
                data: null,
                err,
            });
        });
};

const create = async (req, res) => {
    var profile = new Profile(req.body);
    var type = profile.parentModelName;
    var parentId = profile.parent;
    switch (type) {
        case "User":
            var user = await User.findById(parentId);
            user.profile = profile._id;
            await user.save();
            break;

        case "Organization":
            var organization = await User.findById(parentId);
            organization.profile = profile._id;
            await organization.save();
            break;

        default:
            break;
    }

    profile.save().then(profile => {
        res.json(profile);
    });
};

const update = (req, res) => {
    var profileObject = req.body;
    var profileId = profileObject._id;
    Profile.findByIdAndUpdate(profileId, profileObject, {new: true}, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            res.json(resp);
        }
    });
};

const getUsers = async () => {
    try {
        const users = await User.find({}, "displayName").populate("displayPicture", "url thumbUrl");
        return users;
    } catch (error) {
        console.log(error);
    }
};

const getUserProfileDetail = (req, res) => {
    const userIds = req.body.userIds;
    async.map(
        userIds,
        function (userId, callback) {
            User.findById(userId)
                .populate("displayPicture", "url thumbUrl")
                .then(user => {
                    callback(null, user);
                })
                .catch(err => {
                    callback(err);
                });
        },
        function (err, results) {
            res.json({
                status: "200",
                result: results,
            });
        }
    );
};

module.exports = {
    createAndSetForUser,
    get,
    getProfile,
    getProfiles,
    getProfileParent,
    create,
    update,
    getUsers,
    getUserProfileDetail,
};
