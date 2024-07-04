const Profile = require("../models/profile.model");
const Chat = require("../models/chatAndMessages.model");
const Issue = require("../models/issue.model");
const Doc = require("../models/doc.model");
const {Message, Conversation} = Chat;
const Transaction = require("../models/wallet.transaction.model");
const ChartAccount = require("../models/wallet.chart.account.model");
const {profileIssueHelper} = require("./issue.controller");
const ObjectId = require("mongoose").Types.ObjectId;
const {setRedisProfileModule} = require("./redis.controller");
const Team = require("../models/team.model");

const profileWalletData = async walletId => {
    const chartAccounts = await ChartAccount.find({wallet: walletId});

    return {
        chartAccounts,
    };
};

const getAdminProfileHelper = async profileId => {
    try {
        const userProfileId = profileId;

        const adminProfileSet = new Set([userProfileId]);
        let adminProfileIds = [userProfileId];

        const orgTeams = await Team.find({
            participants: {$in: adminProfileIds},
            parentModelName: "Organization",
        })
            .select("parent parentModelName participants permissions")
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            });

        orgTeams.map(team => {
            const perm = JSON.parse(JSON.stringify(team?.permissions));

            const role = perm[userProfileId];
            const orgProfileId = team?.parent?.profile;

            if (role == "Admin" || role == "Owner") {
                if (orgProfileId) {
                    adminProfileSet.add(orgProfileId);
                }
            }
        });

        adminProfileIds = Array.from(adminProfileSet);

        return {
            adminProfileIds,
            orgTeams,
        };
    } catch (error) {
        console.error(error, " is the error");
        return null;
    }
};

const getProfileData = async (req, res, next) => {
    const profileId = req.body.profileId;
    const walletId = req.body.walletId;

    const isAdmin = req.body.isAdmin;
    const a = new Date();
    // console.log(profileId, walletId, " is the profileId");
    try {
        if (ObjectId.isValid(profileId)) {
            let docQueries = [{profile: profileId}];
            docQueries.push({shared: {$in: [profileId]}});

            let issueQueries = [...docQueries, {assigned: {$in: [profileId]}}];

            let finalDocQuery = {
                $or: docQueries,
            };

            let finalIssueQuery = {
                $or: issueQueries,
            };

            if (!isAdmin) {
                finalDocQuery = {
                    $or: docQueries,
                    private: false,
                };

                finalIssueQuery = {
                    $or: issueQueries,
                    private: false,
                };
            }

            const conversations = Conversation.find({
                participants: {$in: [profileId]},
            })
                .populate("topMessage")
                .populate({
                    path: "participants",
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
                    path: "participantsRole",
                    model: "AccessRole",
                    populate: {
                        path: "user",
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
                })
                .limit(20)
                .sort("-updatedAt");

            const docs = Doc.find(finalDocQuery)
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
                    path: "shared",
                    select: "parent parentModelName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .sort({createdAt: -1})
                .limit(5);

            const transactions = Transaction.find({
                $or: [{secondParty: profileId}, {firstParty: profileId}],
            })
                .sort({createdAt: -1})
                .limit(5)
                .populate({
                    path: "secondParty",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "firstParty",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                });

            const issues = profileIssueHelper(profileId, isAdmin);

            // const issues = Issue.find(finalIssueQuery)
            //     .populate({
            //         path: "user",
            //         select: "name displayName model",
            //         populate: {
            //             path: "displayPicture",
            //             model: "File",
            //             select: "url thumbUrl",
            //         },
            //     })
            //     .populate('template','title')
            //     .populate('status')
            //     .populate({
            //         path : 'assigned',
            //         select: 'parent parentModelName',
            //         populate: {
            //             path: "displayPicture",
            //             model: "File",
            //             select: "url thumbUrl",
            //         }
            //     })
            //     .populate({
            //         path:'checklist'
            //     })
            //     .populate('files')
            //     .sort({ createdAt: -1 })
            //     .limit(5)

            let promises = [issues, docs];

            if (isAdmin) {
                const profileAndChartAcct = profileWalletData(walletId);

                promises = [issues, docs, conversations, profileAndChartAcct, transactions];
                // promises = [issues, docs ];
            }

            console.log(promises.length, " is the promises length");

            Promise.allSettled(promises).then(async results => {
                console.log(results, " are the results");
                const issueResults = results[0].value.issues;

                const docResults = results[1].value;
                console.log(issueResults, " is the issueResults");
                if (isAdmin) {
                    const b = new Date();
                    console.log(b - a);
                    const convResults = results[2].value;
                    const profileChartAccounts = results[3].value;
                    const txs = isAdmin ? results[4].value : [];

                    res.status(200).json({
                        data: {
                            docs: docResults,
                            issues: issueResults,
                            conversations: convResults,
                            transactions: txs,
                            ...profileChartAccounts,
                        },
                    });

                    const redisResult = await setRedisProfileModule("adminIssues", "issues", profileId, issueResults);
                    // console.log(redisResult, " is the redisResult");
                } else {
                    const b = new Date();
                    console.log(b - a);
                    res.status(200).json({
                        data: {
                            docs: docResults,
                            issues: issueResults,
                        },
                    });
                    const redisResult = await setRedisProfileModule("memberIssues", "issues", profileId, issueResults);
                    // console.log(redisResult, " is the redisResult");
                }
            });
        } else {
            res.status(400).json({
                data: null,
            });
        }
    } catch (error) {
        console.log(error, " is the error");
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getAdminProfiles = async (req, res) => {
    const profileId = req.body.profileId;
    const data = await getAdminProfileHelper(profileId);

    res.status(200).json({
        data,
    });
};

module.exports = {
    getProfileData,
    getAdminProfileHelper,
    getAdminProfiles,
};
