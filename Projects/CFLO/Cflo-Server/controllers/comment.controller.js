const CommentAndDiscussion = require("../models/commentAndDiscussion");
const {Comment, Discussion} = CommentAndDiscussion;
const Task = require("../models/task.model");
const Team = require("../models/team.model");
const Issue = require("../models/issue.model");
const Application = require("../models/application.model");
const Post = require("../models/post.model");
var _ = require("../helpers/array.utils");
const async = require("async");
const activityController = require("./activity.controller");
const lodash = require("lodash");

const modelDict = {
    Comment,
    Discussion,
    Task,
    Team,
    Issue,
    Application,
    Post,
};

const createInParent = (req, res) => {
    var comment = new Comment(req.body);
    var parentId = comment?.parent;
    var modelName = comment?.parentModelName;
    var Parent = modelDict[modelName];

    var commentId = comment?._id;

    async.parallel(
        [
            function (callback) {
                comment?.save().then(comment => {
                    Comment.findById(commentId)
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
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        })
                        .then(comment => {
                            callback(null, comment);
                        });
                });
            },
            function (callback) {
                Parent.findById(parentId).then(parent => {
                    var parentCommentOld = parent.comments ? parent.comments : [];
                    parent.comments = _.union([commentId], parentCommentOld);

                    parent.save().then(parent => {
                        callback(null, parent);
                    });
                });
            },
        ],
        function (err, results) {
            res.json({
                status: "200",
                result: {
                    comment: results[0],
                    parent: results[1],
                },
            });
        }
    );
};

const getByIds = (req, res) => {
    const comments = req.body.comments;
    async.map(
        comments,
        function (commentId, callback) {
            Comment.findById(commentId)
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
                .then(comment => {
                    callback(null, comment);
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

const create = async (req, res) => {
    try {
        let comment = new Comment(req.body);
        const notifyArr = req.body.notify || [];
        comment = await comment?.save();

        //updating commentCount
        if (comment?.parentModelName) {
            let parent = await modelDict[comment?.parentModelName].findById(comment?.parent);
            const updateParentObj =
                parent?.commentCount || parent?.commentCount === 0 ? {commentCount: parent.commentCount + 1} : {};
            parent = await modelDict[comment?.parentModelName].findByIdAndUpdate(comment?.parent, updateParentObj, {
                new: true,
            });
        }

        comment = await Comment.findById(comment?._id)
            .populate({
                path: "parent",
                select: "title description profile user commentCount",
                populate: [
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
                ],
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
            })
            .populate("files");

        // console.log("comment", comment);

        const activityObject = {
            type: "Commented",
            title: `${comment?.profile?.parent?.displayName} commented on your post "${comment?.parent?.title || ""}"`,
            body: comment?.text,
            data: comment?._id,
            dataModel: "Comment",
            user: comment?.user?._id,
            profile: comment?.profile?._id,
            parent: comment?._id,
            parentModelName: comment?.parentModelName,
            notify: [comment?.parent?.profile?._id],
        };
        activityController.create(req, activityObject, [comment?.parent?.profile?._id]);

        const notifyActivityObject = {
            type: "mentioned",
            title: `${comment?.profile?.parent?.displayName} Mentioned you in comment of post ${
                comment?.parent?.title || ""
            }`,
            body: comment?.text,
            data: comment?._id,
            dataModel: "Comment",
            user: comment?.user?._id,
            profile: comment?.profile?._id,
            parent: comment?._id,
            parentModelName: comment?.parentModelName,
            notify: notifyArr,
        };
        activityController.create(req, notifyActivityObject, notifyArr);
        res.status(201).json({
            comment,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            comment: null,
            error,
        });
    }
};

const getComments = async (req, res) => {
    var parentId = req.body.parent;
    var model = req.body.model;
    var limit = req.body.limit;
    try {
        let comments = Comment.find({parent: parentId, parentModelName: model})
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
            .populate("files")
            .sort({createdAt: -1});

        // console.log(comments);
        if (limit && limit >= 0) comments = await comments.limit(limit);
        else comments = await comments;
        // .then(comments => {
        // });
        res.json(comments);
    } catch (error) {
        res.status(400).json({
            data: null,
            message: "Something went wrong",
        });
    }
};

const updateComment = (req, res) => {
    var commentObject = req.body;
    var commentId = commentObject._id;
    const notifyArr = req.body.notify || [];

    Comment.findByIdAndUpdate(commentId, commentObject, {new: true}, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            Comment.findById(commentId)
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
                .populate({
                    path: "parent",
                    select: "title description profile user",
                    populate: [
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
                    ],
                })
                .then(comment => {
                    const notifyActivityObject = {
                        type: "mentioned",
                        title: `${comment?.profile?.parent?.displayName} Mentioned you in comment of post ${comment?.parent?.title}`,
                        body: comment?.text,
                        data: comment?._id,
                        dataModel: "Comment",
                        user: comment?.user?._id,
                        profile: comment?.profile?._id,
                        parent: comment?._id,
                        parentModelName: comment?.parentModelName,
                        notify: notifyArr.map(id => ({entity: id, entityName: "Profile"})),
                    };
                    activityController.create(req, notifyActivityObject, notifyArr);

                    res.json(comment);
                });
        }
    });
};

const deleteComment = async (req, res) => {
    try {
        var commentId = req.body.commentId;
        let comment = await Comment.findById(commentId);

        //updating commentCount
        if (comment?.parentModelName) {
            let parent = await modelDict[comment?.parentModelName]?.findById(comment?.parent);
            const updateParentObj =
                parent?.commentCount || parent?.commentCount === 0 ? {commentCount: parent.commentCount - 1} : {};
            parent = await modelDict[comment?.parentModelName]?.findByIdAndUpdate(comment?.parent, updateParentObj, {
                new: true,
            });
        }

        comment = await Comment.findByIdAndDelete(commentId);
        res.json({
            status: "200",
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            message: "Something went wrong",
        });
    }
};

module.exports = {
    create,
    createInParent,
    updateComment,
    deleteComment,
    getByIds,
    getComments,
};
