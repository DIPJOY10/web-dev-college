const Issue = require("../models/issue.model");
const IssueTemplate = require("../models/issue.template.model");
const Profile = require("../models/profile.model");
const Team = require("../models/team.model");
const Task = require("../models/task.model");
const redisClient = require("../services/redis");
var _ = require("lodash");
var async = require("async");
const teamProjectSocket = require("../services/team.project.socket");
const socketApi = require("../services/socket");

const {create: createActivity} = require("./activity.controller");
const {getRedisProfileModule} = require("./redis.controller");
const StatusItem = require("../models/issue.status.item.model");
const ObjectId = require("mongoose").Types.ObjectId;

const profileIssueHelper = async (profileId, isAdmin) => {
    try {
        if (ObjectId.isValid(profileId)) {
            // let redisIssues = null;
            // console.log('profileIssueHelper called')
            // try {
            //     if (isAdmin) {
            //         redisIssues = await getRedisProfileModule("adminIssues", "issues", profileId);
            //     } else {
            //         redisIssues = await getRedisProfileModule("memberIssues", "issues", profileId);
            //     }
            // } catch (error) {
            //     console.log(error,' is the error')
            // }

            // console.log(redisIssues, " is the redisIssuesgi");

            // if (redisIssues) {
            //     return {
            //         issueLength: redisIssues.length,
            //         issues: redisIssues,
            //     };
            // }

            let queries = [{profile: profileId}];
            queries.push({shared: {$in: [profileId]}});

            queries.push({assigned: {$in: [profileId]}});

            let issueQuery = {
                $or: queries,
            };

            if (!isAdmin) {
                issueQuery = {
                    $or: queries,
                    private: false,
                };
            }

            const issues = await Issue.find(issueQuery)
                .populate({
                    path: "user",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate("template", "title")
                // .populate('status')
                .populate({
                    path: "assigned",
                    select: "parent parentModelName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "checklist",
                })
                .populate("files")
                .limit(25);

            return {
                issueLength: issues.length,
                issues: issues,
            };
        } else {
            return {
                issueLength: 0,
                issues: [],
            };
        }
    } catch (error) {
        return {
            issueLength: 0,
            issues: [],
        };
    }
};

const getProfileIssues = async (req, res) => {
    try {
        const profileId = req.body.profile;
        if (ObjectId.isValid(profileId)) {
            let queries = [{profile: profileId}];
            queries.push({shared: {$in: [profileId]}});

            queries.push({assigned: {$in: [profileId]}});

            const issues = await Issue.find({
                $or: queries,
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
                .populate("parent")
                .populate({
                    path: "template",
                    model: "IssueTemplate",
                    populate: {
                        path: "pipeline",
                        model: "StatusItem",
                    },
                })
                // .populate("shared")
                // .populate('status')
                // .populate('template')
                .populate({
                    path: "assigned",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },

                        // path: "displayPicture",
                        // model: "File",
                        // select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "shared",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },

                        // path: "displayPicture",
                        // model: "File",
                        // select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "checklist",
                })
                .populate("files")
                .populate({
                    path: "activeUserId",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                }).populate({
                    path: "activeUserProfile",
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
                .sort({createdAt: -1});
            // .limit(25);

            // console.log(issues, " are the issues");

            res.status(200).json({
                data: {
                    issueLength: issues.length,
                    issues: issues,
                },
            });
        } else {
            res.status(400).json({
                data: null,
                error: "Not a valid id",
            });
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getRentalRelationIssues = async (req, res) => {
    try {
        const rentalRelationId = req.body.rentalRelationId;

        if (ObjectId.isValid(rentalRelationId)) {
            const issues = await Issue.find({parent: rentalRelationId, parentModelName: "RentalRelation"})
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
                    path: "template",
                    model: "IssueTemplate",
                    populate: {
                        path: "pipeline",
                        model: "StatusItem",
                    },
                })
                .populate({
                    path: "assigned",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "shared",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "checklist",
                })
                .populate("files")
                .populate({
                    path: "activeUserId",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                }).populate({
                    path: "activeUserProfile",
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
                data: {
                    issueLength: issues.length,
                    issues: issues,
                },
            });
        } else {
            res.status(400).json({
                data: null,
                error: "Not a valid id",
            });
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getMoreIssues = async (req, res) => {
    try {
        const profileId = req.body.profile;
        const skip = req.body.skip;
        const queries = profileId ? [{profile: profileId}] : [];
        queries.push({shared: {$in: [profileId]}});
        queries.push({assigned: {$in: [profileId]}});
        const issues = await Issue.find({
            $or: queries,
        })
            .populate("files")
            .limit(25)
            .skip(skip);

        res.status(200).json({
            data: issues,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const create = async(req, res) => {
    var issue = new Issue(req.body);
    const templateId = issue.template;
    var template = await IssueTemplate.findById(templateId)
    issue.issueId = template.issueCounter;
    template.issueCounter = template.issueCounter + 1

    issue.save().then(async(issue) => {
        await template.save();
        const issueId = issue._id;
        Issue.findById(issueId)
            .populate("files")
            .populate("parent")
            .populate([
                {
                    path: "user",
                    select: "name displayName wallet model profile",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            ])
            .populate({
                path: "profile",
                model: "Profile",
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
                path: "activeUserId",
                select: "name displayName model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            }).populate({
                path: "activeUserProfile",
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
                path: "template",
                model: "IssueTemplate",
                populate: {
                    path: "pipeline",
                    model: "StatusItem",
                },
            })
            .populate({
                path: "assigned",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shared",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "checklist",
            })
            .then(issue => {
                console.log("issue", issue?.notify);
                createActivity(
                    req,
                    {
                        title: `${issue.user.displayName} created an issue`,
                        body: issue.title,
                        type: "IssueCreated",
                        data: issueId,
                        dataModel: "Issue",
                        parent: issue?.parent,
                        parentModelName: issue?.parentModelName,
                        // notify: [issue?.parent],
                        user: issue.user._id,
                        profile: issue.profile._id,
                        raw:JSON.stringify(issue),
                    },
                    issue.assigned,
                    issue?.user?.profile
                );

                res.status(200).json({
                    data: issue,
                });
            });
    });
};

const openCloseIssues = (req, res) => {
    var IssueArray = req.body.IssueArray;
    var bulkUpdateOps = IssueArray.map(issueObj => {
        return {
            updateOne: {
                filter: {_id: issueObj?._id},
                update: {$set: issueObj?.set},
            },
        };
    });
    try {
        Issue.bulkWrite(bulkUpdateOps, {ordered: true, w: 1}, function (err, result) {
            if (err) {
                res.json({
                    success: false,
                    error: err,
                });
            } else {
                res.json({
                    success: true,
                });
            }
        });
    } catch (e) {
        res.json({
            success: false,
            error: e,
        });
    }
};

const update = (req, res) => {
    var issueObject = req.body;
    var issueId = issueObject._id;

    Issue.findByIdAndUpdate(issueId, issueObject, {new: true}, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            Issue.findById(issueId)
                .populate("files")
                .populate("parent")
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
                    path: "template",        
                    populate: {
                        path: "pipeline"
                    }
                })
                .populate({
                    path: "template",        
                    populate:{
                        path: "form",
                        populate: {
                            path: "questions",
                            model: "Question",
                            populate: {
                                path: "options",
                                // model: "FormOption",
                            },
                        },
                    }
                })
                .populate({
                    path: "template",        
                    populate:{
                        path: "form",
                        populate: {
                            path: "questions",
                            model: "Question",
                            populate: {
                                path: "optionCols",
                                // model: "FormOption",
                            },
                        },
        
                    }
                })
                .populate({
                    path: "profile",
                    model: "Profile",
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
                    path: "activeUserId",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                }).populate({
                    path: "activeUserProfile",
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
                    path: "template",
                    model: "IssueTemplate",
                    populate: {
                        path: "pipeline",
                        model: "StatusItem",
                    },
                })
                .populate({
                    path: "assigned",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "shared",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "checklist",
                })
                .populate("files")
                .then(issue => {
                    createActivity(
                        req,
                        {
                            title: `${req.body.activeUserId.displayName} updated an issue`,
                            body: issue.title,
                            type: "IssueUpdated",
                            data: issueId,
                            dataModel: "Issue",
                            parent: issue?.parent,
                            parentModelName: issue?.parentModelName,
                            // notify: [issue?.parent],
                            user: req?.body?.activeUserId,
                            profile: req?.body?.activeUserProfile,
                            raw:JSON.stringify(issue),
                        },
                        issue.assigned,
                        issue?.user?.profile
                    );
                    res.json(issue);
                });
        }
    });
};

const updateTemplateStatus = (req, res) => {
    var issueObject = req.body;
    var issueId = issueObject._id;

    Issue.updateOne(
        {_id: issueId},
        {
            $set: {
                status: issueObject?.status,
                template: issueObject?.template,
                closed: issueObject?.closed,
            },
        },
        function (err, resp) {
            if (err) {
                console.log(err);
                res.json({
                    issue: null,
                    error: err,
                });
            } else {
                Issue.findById(issueId)
                    .populate("files")
                    .populate("parent")
                    .populate("checklist template")
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
                        path: "user",
                        select: "name displayName",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    })
                    .populate({
                        path: "profile",
                        model: "Profile",
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
                        path: "template",
                        model: "IssueTemplate",
                        populate: "pipeline",
                        // populate: {
                        //     path: "parent",
                        //     select: "name displayName",
                        //     populate: {
                        //         path: "displayPicture",
                        //         model: "File",
                        //         select: "url thumbUrl",
                        //     },
                        // },
                    })
                    .populate({
                        path: "assigned",
                        model: "Profile",
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
                        path: "shared",
                        model: "Profile",
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
                        path: "transactions",
                        populate: {
                            path: "billList",
                            model: "BillList",
                            populate: {
                                path: "items",
                                populate: {
                                    path: "offering",
                                },
                            },
                        },
                    })
                    .populate({
                        path: "calendarEvents",
                        populate: {
                            path: "people",
                            model: "Profile",
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
                    })
                    .then(issue => {
                        res.json({
                            issue: issue,
                        });
                    });
            }
        }
    );
};
const getIssuesByIds = (req, res) => {
    const issues = req.body.issues;
    async.map(
        issues,
        function (issueId, callback) {
            Issue.findById(issueId)
                .populate("files")
                .populate("parent")
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
                    model: "Profile",
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
                .then(issue => {
                    callback(null, issue);
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

const getIssueDetail = async (req, res) => {
    const issueId = req.body.issue;

    try {
        const issue = await Issue.findById(issueId)
            .populate("files")
            .populate("parent")
            .populate("checklist")
            .populate("formResponses")
            .populate({
                path: "template",        
                populate: {
                    path: "pipeline"
                }
            })
            .populate({
                path: "template",        
                populate:{
                    path: "form",
                    populate: {
                        path: "questions",
                        model: "Question",
                        populate: {
                            path: "options",
                            // model: "FormOption",
                        },
                    },
                }
            })
            .populate({
                path: "template",        
                populate:{
                    path: "form",
                    populate: {
                        path: "questions",
                        model: "Question",
                        populate: {
                            path: "optionCols",
                            // model: "FormOption",
                        },
                    },
    
                }
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
                path: "profile",
                model: "Profile",
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
                path: "assigned",
                model: "Profile",
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
                path: "shared",
                model: "Profile",
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


        res.status(200).json({
            data: issue,
        });
    } catch (error) {
        console.log(error, " is the error");
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const deleteIssue = (req, res) => {
    var issueId = req.body.issueId;
    Issue.findById(issueId).then(issue => {
        var teamId = issue.team;
        Team.findById(teamId).then(team => {
            team.numIssues = team.numIssues - 1;
            team.save().then(team => {
                Issue.findByIdAndDelete(issueId).then(result => {
                    res.json(team);
                });
            });
        });
    });
};
const createDefaultIssuePipeline = async () => {
    //States: Recieved, Under Review, Shortlisted, Accepted, Rejected
    //Choose color: 
    //InsertMany statusItems
    let findIssueDefaultTemplate = await IssueTemplate.find({ platform: true, title: "Issue Default" });
    if (findIssueDefaultTemplate.length > 0) {
        return null;
    }
    else {
        let findTemplate = await IssueTemplate.find({ platform: true });
        console.log(findTemplate, "FindTemplate");
        const defaultPipeline = [
            {
                text: "Received",
                color: "#00FF80",
            },
            {
                text: "Under Review",
                color: "#FF8000",
            },
            {
                text: "Shortlisted",
                color: "#FF8000",
            },
            {
                text: "Accepted",
                color: "#00FFFF",
            },
            {
                text: "Rejected",
                color: "#FF00FF",
            },


        ];

        const statusItems = await StatusItem.insertMany(defaultPipeline);
        const template = {
            pipeline: statusItems.map((statusItemsId) => { return statusItemsId?._id }),
            type: 'Issue',
            title: "Issue Default",
            platform: true,
            startState: statusItems[0]?._id
        }
        let createTemplate = new IssueTemplate(template);
        await createTemplate.save();
        console.log(createTemplate);
        if (findTemplate.length === 0) {
            await IssueTemplate.insertMany(createTemplate);
        }
        return createTemplate;
    }
}
// createDefaultIssuePipeline()
module.exports = {
    profileIssueHelper,
    getProfileIssues,
    getMoreIssues,
    getIssuesByIds,
    getIssueDetail,
    create,
    update,
    deleteIssue,
    openCloseIssues,
    getRentalRelationIssues,
    updateTemplateStatus,
    createDefaultIssuePipeline
};
