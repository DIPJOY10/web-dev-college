const Post = require("../models/post.model");
const Poll = require("../models/poll.model");
const Follow = require("../models/follow.model");
const mongoose = require("mongoose");

const create = async (req, res) => {
    try {
        let poll = undefined;
        if (req?.body?.poll) {
            poll = new Poll(req?.body?.poll);
        }

        var post = new Post({
            ...req.body,
            poll: poll?._id,
        });

        if (poll) {
            poll.parent = post._id;
            poll.parentModelName = "Post";
            poll = await poll.save();
        }

        post = await post.save();

        Post.findById(post._id)
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
            })
            .populate("files")
            .then(post => {
                res.json(post);
            });
    } catch (error) {
        res.send(error);
    }
};

const update = async (req, res) => {
    var postObject = req.body;
    var postId = postObject?._id;
    var pollId = postObject?.poll?._id;

    try {
        if (req?.body?.poll) {
            let poll;
            if (!pollId) {
                poll = new Poll(req?.body?.poll);
                poll = await poll.save();
                pollId = poll._id;
            }

            poll = await Poll.findByIdAndUpdate(pollId, postObject.poll, {new: true});
            postObject.poll = poll._id;
        }

        // console.log("here");
        let post = await Post.findByIdAndUpdate(postId, postObject, {new: true});
        // console.log("here1");

        post = await Post.findById(postId)
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
                path: "owner",
                select: "name displayName  model profile",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "user",
                select: "name displayName  model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
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
            })
            .populate("files");
        // console.log(post);
        res.json(post);
    } catch (err) {
        console.log(err);
        res.send(err);
    }
};

const deletePost = async (req, res) => {
    var postId = req.body.postId;
    const post = await Post.findById(postId);

    //deleting poll
    if (post?.poll) {
        await Poll.findByIdAndDelete(post.poll);
    }

    //deleting post
    Post.findByIdAndDelete(postId).then(result => {
        res.json(result);
    });
};

const getProfilePosts = async (req, res) => {
    try {
        const userProfile = req.body.userProfile;
        const aggPost = await Post.aggregate([
            {
                $match: {
                    //find all of the posts of user
                    profile: mongoose.Types.ObjectId(userProfile),
                    published: true,
                },
            },
            {
                //try to find an 'save' document in database that have 'parent' as the this post and profile as the userProfile
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                //try to find an 'like' document in database that have 'post' set to this post and profile set to the userProfile
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    //if any such 'like' document found in database that have 'post' set to this post and profile set to the userProfile
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
                                    },
                                    0,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                    //if any such 'save' document found in database that have 'parent' set to this post and profile set to the userProfile
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
                },
            },
            {
                $project: {
                    //hiding likes ans saves fields
                    saves: 0,
                    likes: 0,
                },
            },
        ]);

        await Post.populate(aggPost, [
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
        res.json({
            posts: aggPost,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

const getPostById = async (req, res) => {
    try {
        const postId = req.body._id;
        const userProfile = req.body.userProfile;
        const aggPost = await Post.aggregate([
            {
                $match: {
                    //find all of the posts of user
                    _id: mongoose.Types.ObjectId(postId),
                },
            },
            {
                //try to find an 'save' document in database that have 'parent' as the this post and profile as the userProfile
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                //try to find an 'like' document in database that have 'post' set to this post and profile set to the userProfile
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    //if any such 'like' document found in database that have 'post' set to this post and profile set to the userProfile
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
                                    },
                                    0,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                    //if any such 'save' document found in database that have 'parent' set to this post and profile set to the userProfile
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
                },
            },
            {
                $project: {
                    //hiding likes ans saves fields
                    saves: 0,
                    likes: 0,
                },
            },
        ]);

        await Post.populate(aggPost, [
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
        res.json(aggPost?.length && aggPost?.length > 0 ? aggPost[0] : null);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

const getAllFollowingPosts = async (req, res) => {
    try {
        const {userProfile, page} = req.body;
        // console.log("respose", req.body);
        const onePageCount = 10;
        /*
        let followingPosts = await Follow.aggregate([
            {
                $match: {
                    //Find all of the users that is followed by requested user
                    //uncomment to get follower post only
                    // userProfile: mongoose.Types.ObjectId(userProfile),
                },
            },
            {
                $lookup: {
                    //Find all fo the post of each user
                    from: "posts",
                    localField: "profile",
                    foreignField: "profile",
                    as: "followingPosts",
                    //try to use pipeline to find only published posts
                },
            },
            {
                //only display posts
                $project: {followingPosts: 1, _id: 0},
            },
            {
                //seperate all of the posts of individually, and remove all of the users that do not have any post
                $unwind: "$followingPosts",
            },
            {
                //remove all unpulished posts
                $match: {"followingPosts.published": true},
            },
            {
                //replace each document by the post
                $replaceRoot: {newRoot: "$followingPosts"},
            },
            {
                //sort by latest first
                $sort: {createdAt: -1},
            },
            {
                //pagination step 1
                $limit: page * 100 + 10,
            },
            {
                //pagination step 2
                $skip: page * 100,
            },

            {
                //try to find an 'save' document in database that have 'parent' as the this post and profile as the userProfile
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                //try to find an 'like' document in database that have 'post' set to this post and profile set to the userProfile
                
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    // likeCount: {$cond: {if: {$isArray: "$likes"}, then: {$size: "$likes"}, else: 0}},
                    // commentCount: {$cond: {if: {$isArray: "$comments"}, then: {$size: "$comments"}, else: 0}},
                    isLiked: {
                    //if any such 'like' document found in database that have 'post' set to this post and profile set to the userProfile

                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
                                    },
                                    0,
                                ],
                            },
                            true,
                            false,
                        ],
                    },
                    isSaved: {
                    //if any such 'save' document found in database that have 'parent' set to this post and profile set to the userProfile
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
                },
            },
            {
                $project: {
                    likes: 0,
                    saves: 0,
                },
            },
        ]);
        */

        const aggPost = await Post.aggregate([
            {
                $match: {
                    // _id: mongoose.Types.ObjectId(postId),
                    published: true,
                    channels: undefined || [],
                },
            },
            {
                $sort: {createdAt: -1},
            },
            {
                $limit: page * onePageCount + onePageCount, //10 post send
            },
            {
                $skip: page * onePageCount,
            },
            {
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
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
                },
            },
            {
                $project: {
                    likes: 0,
                    saves: 0,
                },
            },
        ]);

        // console.log("here");

        let followingPosts = await Post.populate(aggPost, [
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

        res.status(200).json({
            followingPosts,
        });
    } catch (error) {
        res.send(error);
    }
};

const convertStringArrayToObjectIdArray = function (stringArray) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(stringArray)) reject(new Error("function except an Array."));
        const objectArr = stringArray.map(id => mongoose.Types.ObjectId(id));
        resolve(objectArr);
    });
};

const getPostsData = async (req, res) => {
    try {
        const profileIds = req.body.profileIds;
        // console.log({profileIds});

        const profileIdsObject = await convertStringArrayToObjectIdArray(profileIds);
        // console.log(profileIdsObject);

        let data = await Post.aggregate([
            {
                $match: {profile: {$in: profileIdsObject}, published: true},
            },
            {
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: {$in: profileIdsObject}},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: {$in: profileIdsObject}},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
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
                },
            },
            {
                $project: {
                    isLiked: 1,
                    isSaved: 1,
                    commentCount: 1,
                    likeCount: 1,
                    poll: 1,
                    user: 1,
                },
            },
        ]);

        // console.log({data});
        data = await Post.populate(data, [
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
                path: "files",
            },
        ]);
        // console.log({data});
        res.status(200).json({
            data,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

const getAllPostsOfCommunities = async (req, res) => {
    try {
        let {communitiesProfileIds = [], page = 0, limit = 10, userProfile} = req.body;
        communitiesProfileIds = await convertStringArrayToObjectIdArray(communitiesProfileIds || []);
        console.log("....", communitiesProfileIds);

        let posts = await Post.aggregate([
            {
                $match: {
                    channels: {
                        $elemMatch: {$in: communitiesProfileIds},
                    },
                    published: true,
                },
            },
            {
                $sort: {createdAt: -1},
            },
            {
                $limit: page * limit + limit, //include extra post for page send
            },
            {
                $skip: page * limit,
            },
            {
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
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
                },
            },
            {
                $project: {
                    likes: 0,
                    saves: 0,
                },
            },
        ]);

        posts = await Post.populate(posts, [
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
                path: "channels",
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
                path: "files",
            },
        ]);

        res.status(200).json({
            joinedCommunitiesPosts: posts,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

const getPopularFeedPosts = async (req, res) => {
    try {
        const {userProfile, page, limit = 10} = req.body;
        // console.log("respose", req.body);
        const onePageCount = limit;
        const aggPost = await Post.aggregate([
            {
                $match: {
                    published: true,
                    channels: undefined || [],
                },
            },
            {
                $sort: {likeCount: -1},
            },
            {
                $limit: page * onePageCount + onePageCount, //10 post send
            },
            {
                $skip: page * onePageCount,
            },
            {
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
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
                },
            },
            {
                $project: {
                    likes: 0,
                    saves: 0,
                },
            },
        ]);

        let posts = await Post.populate(aggPost, [
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

        res.status(200).json({
            posts,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

const getPopularForumPosts = async (req, res) => {
    try {
        const {userProfile, page, limit = 10} = req.body;
        const onePageCount = limit;
        const aggPost = await Post.aggregate([
            {
                $match: {
                    published: true,
                    channels: {$exists: true, $not: {$size: 0}},
                },
            },
            {
                $sort: {likeCount: -1},
            },
            {
                $limit: page * onePageCount + onePageCount, //10 post send
            },
            {
                $skip: page * onePageCount,
            },
            {
                $lookup: {
                    from: "saves",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "saves",
                },
            },
            {
                $lookup: {
                    from: "likes",
                    localField: "_id",
                    foreignField: "parent",
                    pipeline: [
                        {
                            $match: {profile: mongoose.Types.ObjectId(userProfile)},
                        },
                    ],
                    as: "likes",
                },
            },
            {
                $addFields: {
                    isLiked: {
                        $cond: [
                            {
                                $gt: [
                                    {
                                        $size: "$likes",
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
                },
            },
            {
                $project: {
                    likes: 0,
                    saves: 0,
                },
            },
        ]);

        let posts = await Post.populate(aggPost, [
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
                path: "channels",
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

        res.status(200).json({
            posts,
        });
    } catch (error) {
        console.log(error);
        res.send(error);
    }
};

module.exports = {
    create,
    update,
    deletePost,
    getProfilePosts,
    getPostById,
    getPostsData,
    getAllFollowingPosts,
    getAllPostsOfCommunities,
    getPopularFeedPosts,
    getPopularForumPosts,
};
