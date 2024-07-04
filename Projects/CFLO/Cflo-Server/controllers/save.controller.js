const Save = require("../models/save.model");
const Post = require("../models/post.model");
const Like = require("../models/like.model");
const mongoose = require("mongoose");

const parentPopulate = {
    Job: [
        {
            path: "owner",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "displayName displayPicture profile wallet",
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
        {path: "files"},
        {path: "categories"},
    ],
};

const getAllSavesOfProfiles = async (req, res) => {
    try {
        const {profileIds, parentModelName} = req.body;
        if (!Array.isArray(profileIds)) throw new Error("profileIds should be an Array");

        const saves = await (await Save.find({profile: {$in: profileIds}, parentModelName}))
            .populate({
                path: "profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "user",
                select: "name displayName model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "parent",
                populate: parentPopulate[parentModelName],
            });

        res.status(200).json({
            saves,
        });
    } catch (err) {
        res.send(err);
    }
};

const convertStringArrayToObjectIdArray = function (stringArray) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(stringArray)) reject(new Error("function except an Array."));
        const objectArr = stringArray.map(id => mongoose.Types.ObjectId(id));
        resolve(objectArr);
    });
};

const getSavePosts = async (req, res) => {
    try {
        const {profileIds} = req.body;
        const page = req.body.page * 1 || 0;
        const profileIdsObject = await convertStringArrayToObjectIdArray(profileIds);
        if (!Array.isArray(profileIds)) throw new Error("profileIds should be an Array");
        let saveAgg = await Save.aggregate([
            {
                $match: {
                    profile: mongoose.Types.ObjectId(profileIds[0]),
                    parentModelName: "Post",
                },
            },
            {
                $lookup: {
                    from: "posts",
                    localField: "parent",
                    foreignField: "_id",
                    as: "post",
                },
            },
            {
                $unwind: "$post",
            },
            {
                $replaceRoot: {newRoot: "$post"},
            },
            {
                $sort: {createdAt: -1},
            },
            {
                $limit: page * 100 + 10,
            },
            {
                $skip: page * 100,
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "post",
                    as: "likes",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    localField: "_id",
                    foreignField: "parent",
                    as: "comments",
                },
            },
            {
                $addFields: {
                    likeCount: {$cond: {if: {$isArray: "$likes"}, then: {$size: "$likes"}, else: 0}},
                    commentCount: {$cond: {if: {$isArray: "$comments"}, then: {$size: "$comments"}, else: 0}},
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: {
                                            $setIntersection: ["$likes.userProfile", profileIdsObject],
                                        },
                                    },
                                    0,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                    isSaved: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$saves",
                                    },
                                    0,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                    isSaved: true,
                },
            },
        ]);

        await Post.populate(saveAgg, [
            {
                path: "user",
                select: "name displayName  model",
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
                    select: "name displayName ",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            },
            {
                path: "owner",
                select: "name displayName  model profile",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
            {
                path: "poll",
                populate: [
                    {
                        path: "profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                    {
                        path: "user",
                        select: "name displayName  model profile",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            },
            {
                path: "files",
            },
        ]);

        // await Like.populate(saveAgg, [
        //     {
        //         path: "likes.profile",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             select: "name displayName",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        //     {
        //         path: "likes.user",
        //         select: "name displayName  model profile",
        //         populate: {
        //             path: "displayPicture",
        //             model: "File",
        //             select: "url thumbUrl",
        //         },
        //     },
        // ]);

        res.status(200).json({
            data: saveAgg,
        });
    } catch (err) {
        console.log(err);
        res.status(400).json({
            error: err,
        });
    }
};

const createSave = async (req, res) => {
    try {
        const {parent, parentModelName, profile, user} = req.body;

        let save = await Save.find({parent, parentModelName, profile});

        //If already saved, then delete it
        if (save.length > 0) {
            save = await Save.findByIdAndDelete(save[0]._id);

            res.status(200).json({
                save: null,
            });

            return;
        }

        //create a save
        save = new Save({parent, parentModelName, profile, user});
        save = await (await save.save())
            .populate({
                path: "profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "user",
                select: "name displayName model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "parent",
                populate: parentPopulate[parentModelName],
            })
            .execPopulate();
        res.status(201).json({
            save,
        });
    } catch (err) {
        res.status(400).json({
            error: "somethis went wrong",
        });
    }
};

const deleteSave = async (req, res) => {
    try {
        const id = req.body._id;
        await Save.findByIdAndDelete(id);
        res.status(200).json({
            data: null,
        });
    } catch (err) {
        res.send(err);
    }
};

module.exports = {
    getAllSavesOfProfiles,
    getSavePosts,
    createSave,
    deleteSave,
};
