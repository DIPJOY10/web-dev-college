const Like = require("../models/like.model");
const socketApi = require("../services/socket");
const activityController = require("./activity.controller");
const Post = require("../models/post.model");
const {findOneAndDelete} = require("../models/like.model");

const models = {
    Post,
};

const like = async (req, res) => {
    //Same function is used for liking an unliking post
    try {
        let like = await Like.find({parent: req.body.parent, profile: req.body.profile});
        let parent = await Post.findById(req?.body?.parent);

        if (like.length > 0) {
            //Already liked, then dislike
            const deleteObj = await Like.findByIdAndDelete(like[0]._id);
            console.log("deleteObj", deleteObj);
            if (deleteObj)
                parent = await models[deleteObj?.parentModelName]?.findByIdAndUpdate(
                    req?.body?.parent,
                    {likeCount: (parent.likeCount || 0) - 1},
                    {new: true}
                );
            res.json({
                status: 200,
                data: null,
            });
        } else {
            //new like
            like = new Like(req.body);
            like = await like.save();
            parent = await models[like?.parentModelName].findByIdAndUpdate(
                req?.body?.parent,
                {likeCount: (parent.likeCount || 0) + 1},
                {new: true}
            );
            like = await Like.findById(like._id)
                .populate({
                    path: "parent",
                    select: "profile user title channels",
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
                    select: "name displayName wallet model profile",
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
            // console.log("like", like, like?.user?.profile);
            const activityObject = {
                type: "PostLiked",
                title: `${like?.profile?.parent?.displayName} liked your post ${like?.parent?.title}`,
                data: like?._id,
                dataModel: "Like",
                user: like?.user?._id,
                profile: like?.profile?._id,
                parent: like?.parent?._id,
                parentModelName: "Post",
                notify: [like?.parent?.profile._id, ...(like?.parent?.channels || [])],
            };

            console.log("activity object", activityObject);

            activityController.create(
                req,
                activityObject,
                [like?.parent?.profile?._id, ...(like?.parent?.channels || [])],
                like?.user?.profile
            );

            // console.log(activityObject);
            res.json({
                status: 201,
                data: like,
            });
        }
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            error: "Something went wrong",
        });
    }
};

const getPostLikes = async (req, res) => {
    try {
        const {parent} = req.body;
        const likes = await Like.find({parent}).populate({
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
            data: likes,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            error: "Something Went Wrong",
        });
    }
};

module.exports = {like, getPostLikes};
