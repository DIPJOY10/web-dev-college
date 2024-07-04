const User = require("../models/user.model");
const Organization = require("../models/organization.model");
const Pal = require("../models/pal.model");
const Profile = require("../models/profile.model");

const {getUsers} = require("./profile.controller");
var async = require("async");

/**
 * @param { Object } req
 * @param { Object } req.body
 * @param { Object } req.body.searchParams
 * @param { String } req.body.searchParams.type
 * @param { Array.Object } req.body.searchParams.params
 * @param { String } req.body.searchParams.type.params[i].key
 * @param { String } req.body.searchParams.type.params[i].value
 * @returns { Object } res
 */

const getEntityByEmail = (req, res) => {
    var email = req.body.email;
    async.parallel(
        [
            function (callback) {
                User.find({$or: [{email: email}, {emails: {$in: [email]}}]})
                    .populate({
                        path: "profile",
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

                    .then(users => {
                        callback(null, users);
                    });
            },
            function (callback) {
                Organization.find({$or: [{email: email}, {emails: {$in: [email]}}]})
                    .populate({
                        path: "profile",
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
                    .then(organizations => {
                        callback(null, organizations);
                    });
            },
            function (callback) {
                Pal.find({email: email})
                    .populate({
                        path: "profile",
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

                    .then(pals => {
                        callback(null, pals);
                    });
            },
        ],
        function (err, results) {
            var users = results[0] ? results[0] : [];
            var organizations = results[1] ? results[1] : [];
            var pals = results[2] ? results[2] : [];
            var arr = [...users, ...organizations, ...pals].map(ent => ent.profile) || [];
            res.json(arr);
        }
    );
};

const search = async (req, res) => {
    const {searchParams} = req.body;
    const {type, params} = req.body;

    // handle each accorging to type

    switch (type) {
        case "People":
            try {
                const profiles = await getUsers();

                return res.json({
                    status: "200",
                    result: profiles,
                });
            } catch (error) {
                console.log(error);
                res.error(error);
            }

            break;

        case "Projects":
            break;

        case "Jobs":
            break;

        default:
            break;
    }
};

const searchPeople = (req, res) => {
    var name = new RegExp(req.body.name, "ig");

    // populate: {
    //     path: "wallet",
    //     model: "Wallet",
    //     select: "stripeConnectAccountId defaultDwollaBankAccount",
    // },

    async.parallel(
        [
            function (callback) {
                User.find({displayName: name}, "displayName model profile")
                    .populate("displayPicture", "url thumbUrl")
                    .populate({
                        path: "profile",
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
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "wallet",
                                model: "Wallet",
                                select: "stripeConnectAccountId defaultDwollaBankAccount",
                            },
                        },
                    })
                    .then(users => {
                        callback(null, users);
                    });
            },
            function (callback) {
                Organization.find({displayName: name}, "displayName model profile")
                    .populate("displayPicture", "url thumbUrl")
                    .populate("wallet", "stripeConnectAccountId defaultDwollaBankAccount")
                    .populate({
                        path: "profile",
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
                    .then(organizations => {
                        callback(null, organizations);
                    });
            },
        ],
        function (err, results) {
            var users = results[0] ? results[0] : [];
            var organizations = results[1] ? results[1] : [];
            var arr = [...users, ...organizations].map(ent => ent.profile) || [];
            // console.log("orgs are:" + organizations);
            // console.log("users are:" + users);
            res.json(arr);
        }
    );
};

const searchProfile = async (req, res) => {
    try {
        var name = new RegExp("^" + req.body.name);

        let pro = await Profile.aggregate([
            // {
            //     $match: {
            //         parentModelName: {
            //             $in: ["User", "Organization", "Community"],
            //         },
            //     },
            // },
            // {
            //     $cond: {
            //         if: {
            //             parentModelName: "User",
            //         },
            //         then: {
            //             $lookup: {
            //                 from: "users",
            //                 localField: "parent",
            //                 foreignField: "_id",
            //                 as: "parentNew",
            //             },
            //         },
            //         else: {
            //             $cond: {
            //                 if: {
            //                     parentModelName: "Organization",
            //                 },
            //                 then: {
            //                     $lookup: {
            //                         from: "organizations",
            //                         localField: "parent",
            //                         foreignField: "_id",
            //                         as: "parentNew",
            //                     },
            //                 },
            //                 else: {
            //                     $cond: {
            //                         parentModelName: "Organization",
            //                     },
            //                     then: {
            //                         $lookup: {
            //                             from: "communities",
            //                             localField: "parent",
            //                             foreignField: "_id",
            //                             as: "parentNew",
            //                         },
            //                     },
            //                 },
            //             },
            //         },
            //     },
            // },
            {
                $lookup: {
                    from: "organizations",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parentOrganization",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "parent",
                    foreignField: "_id",
                    as: "parentUser",
                },
            },
            // {
            //     $lookup: {
            //         from: "communities",
            //         localField: "parent",
            //         foreignField: "_id",
            //         as: "parentCommunities",
            //     },
            // },
            {
                $addFields: {
                    parent: {$concatArrays: ["$parentUser", "$parentOrganization"]},
                },
            },
            {
                $unwind: "$parent",
            },
            {
                $match: {
                    "parent.displayName": name,
                },
            },
            {
                $lookup: {
                    from: "files",
                    localField: "parent.displayPicture",
                    foreignField: "_id",
                    as: "parent.displayPicture",
                },
            },
            {
                $project: {
                    _id: 1,
                    parentModelName: 1,
                    "parent._id": 1,
                    "parent.name": 1,
                    "parent.displayName": 1,
                    "parent.wallet": 1,
                    "parent.model": 1,
                    "parent.displayPicture._id": 1,
                    "parent.displayPicture.url": 1,
                    "parent.displayPicture.thumbUrl": 1,
                },
            },
        ]);

        const profiles = await Profile.find({
            parentModelName: {
                $in: ["User", "Organization"],
            },
        })
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "name displayName wallet model displayPicture",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
                match: {displayName: name},
            });

        res.json({
            status: 200,
            data: profiles,
            pro,
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
const searchProfileList = async (req, res) => {
    try {
        var name = new RegExp(req.body.name, "ig");

        const profiles = await Profile.find({
            parentModelName: {
                $in: ["User", "Organization"],
            },
        })
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "name displayName wallet model displayPicture",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
                match: {displayName: name},
            });

        res.json({
            status: 200,
            data: profiles,
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

const getUserByName = async (req, res) => {
    try {
        console.log(req.body.name);
        var name = new RegExp(req.body.name, "ig");

        const users = await User.find({displayName: name})
            .limit(15)
            .select("email displayName displayPicture wallet profile")
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate("wallet")
            .populate({
                path: "profile",
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
            data: users,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};












const getOrgByName = async (req, res) => {
    try {
        console.log(req.body.name);
        var name = new RegExp(req.body.name, "ig");

        const users = await Organization.find({displayName: name})
            .limit(15)
            .select("email displayName displayPicture wallet profile")
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate("wallet")
            .populate({
                path: "profile",
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
            data: users,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

module.exports = {
    getEntityByEmail,
    search,
    searchPeople,
    searchProfile,
    searchProfileList,
    getUserByName,
    getOrgByName,
};
