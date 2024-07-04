const Profile = require("../models/profile.model");
const User = require("../models/user.model");
const {record} = require("./accounting/transaction.controller");
const mongoose = require("mongoose");

const getByIds = (req, res) => {
    var userIds = req.body.userIds;
    User.find()
        .where("_id")
        .in(userIds)
        .select("displayName displayPicture")
        .populate("displayPicture", "url thumbUrl")
        .exec((err, records) => {
            res.json(records);
        });
};

const update = (req, res) => {
    var userObject = req.body;
    var userId = userObject._id;

    User.findByIdAndUpdate(userId, userObject, {new: true}, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            User.findById(userId)
                .populate("displayPicture")
                .then(user => {
                    res.json(user);
                });
        }
    });
};

const updateForTransaction = async (req, res) => {
    try {
        var userObject = req.body;
        var userId = userObject._id;
        console.log(req.body, " is the userObject");
        const updatedUser = await User.findByIdAndUpdate(userId, userObject, { new: true })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })

        res.json({
            status: "200",
            data: updatedUser,
        });

    } catch (err) {
        console.log(err)
        res.json({
            status: "400",
            data: null,
            err
        });
    }
};

const userList = (req, res) => {
    console.log(req.body.name);
    var name = new RegExp(req.body.name, "ig");

    let page = req.body.page - 1;
    let limit = page * 15;
    // let userData
    // let totalUser
    var userData;
    var totalUser;
    console.log(page);

    User.find({displayName: name}, "displayName model wallet profile")
        .limit(15)
        .skip(limit)
        .select("displayName displayPicture")
        .populate("displayPicture", "url thumbUrl")
        .exec((err, records) => {
            User.count().then(result => {
                console.log(result);
                res.json({
                    records,
                    result,
                });
            });
        });
};

const updateAddProfile = async () => {
    const userId = "5eda2a828707d951356b82b7";
    const profile = new Profile({
        parent: userId,
        parentModelName: "User",
    });

    let user = await User.findById(userId);
    user.profile = profile._id;
    await user.save();
    await profile.save();
};

const getTopSuggestedUsers = async (req, res) => {
    try {
        const {profile, page = 0, limit = 20} = req.body;

        const users = await Profile.aggregate([
            {
                $match: {
                    // profile: {$ne: mongoose.Types.ObjectId(profile)},
                    parentModelName: "User",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "_id",
                    foreignField: "profile",
                    as: "follows",
                    pipeline: [
                        {
                            $match: {userProfile: mongoose.Types.ObjectId(profile)},
                        },
                    ],
                },
            },
            {
                $match: {$expr: {$eq: [{$size: "$follows"}, 0]}},
            },
            {
                //sort by latest first
                $sort: {followerCount: -1},
            },
            {
                //pagination step 1
                $limit: page * limit + limit,
            },
            {
                //pagination step 2
                $skip: page * limit,
            },
            {
                $project: {
                    parent: 1,
                    // _id: 0,
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parent",
                },
            },
            {
                $unwind: "$parent",
            },
            {
                //replace each document by the post
                $replaceRoot: {newRoot: "$parent"},
            },
            {
                $project: {
                    name: 1,
                    displayName: 1,
                    model: 1,
                    displayPicture: 1,
                    profile: 1,
                },
            },
        ]);

        await User.populate(users, [
            {
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            },
            {
                path: "profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName ",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            },
        ]);

        res.status(200).json({
            users,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};

const getTopSuggestedUsersByLocation = async (req, res) => {
    try {
        const {profile, page = 0, limit = 20, longitude, latitude} = req.body;

        const users = await User.aggregate([
            {
                $geoNear: {
                    near: {type: "Point", coordinates: [longitude * 1, latitude * 1]},
                    distanceField: "dist.calculated",
                    spherical: true,
                    distanceMultiplier: 6378.1, // convert radians to kilometers,
                    key: "location",
                },
            },
            {
                $lookup: {
                    from: "follows",
                    localField: "profile",
                    foreignField: "profile",
                    as: "follows",
                    pipeline: [
                        {
                            $match: {userProfile: mongoose.Types.ObjectId(profile)},
                        },
                    ],
                },
            },
            {
                $match: {$expr: {$eq: [{$size: "$follows"}, 0]}, profile: {$ne: mongoose.Types.ObjectId(profile)}},
            },
            {
                $limit: limit,
            },
            {
                $project: {
                    follows: 0,
                },
            },
        ]);

        await User.populate(users, [
            {
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            },
            {
                path: "profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName ",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            },
        ]);

        res.status(200).json({
            size: users.length,
            users,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: "Something went wrong",
        });
    }
};

module.exports = {
    update,
    getByIds,
    updateAddProfile,
    userList,
    getTopSuggestedUsers,
    getTopSuggestedUsersByLocation,
    updateForTransaction
};
