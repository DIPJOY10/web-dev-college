const {ObjectId} = require("mongoose");
const AccessRole = require("../../models/access.role.model");
const RentalPolicy = require("../../models/rental.policy.model");

const createRentalPolicy = async (req, res) => {
    try {
        let policyObj = req.body.policyObj;
        let projectTeamId = policyObj.projectTeamId;
        let msgWithArr = policyObj.msgWithIdAndRole;
        let docsShareWithArr = policyObj.docShareWithIdAndRole;
        let issuesShareWithArr = policyObj.issuesShareWithIdAndRole;

        let msgWithRoleIdsArr = [];
        let docsShareRoleIdsArr = [];
        let issuesShareRoleIdsArr = [];
        let accessRoleArr = [];

        msgWithArr.length > 0 &&
            msgWithArr.map(msgWith => {
                const accessRoleObj = new AccessRole({
                    user: msgWith.user,
                    role: msgWith.role,
                    parentModelName: "RentalRelation",
                    creator: policyObj.user,
                });
                msgWithRoleIdsArr.push(accessRoleObj._id);
                accessRoleArr.push(accessRoleObj);
            });

        docsShareWithArr.length > 0 &&
            docsShareWithArr.map(docsWith => {
                const accessRoleObj = new AccessRole({
                    user: docsWith.user,
                    role: docsWith.role,
                    parentModelName: "RentalRelation",
                    creator: policyObj.user,
                });
                docsShareRoleIdsArr.push(accessRoleObj._id);
                accessRoleArr.push(accessRoleObj);
            });

        issuesShareWithArr.length > 0 &&
            issuesShareWithArr.map(issuesWith => {
                const accessRoleObj = new AccessRole({
                    user: issuesWith.user,
                    role: issuesWith.role,
                    parentModelName: "RentalRelation",
                    creator: req.body.user,
                });
                issuesShareRoleIdsArr.push(accessRoleObj._id);
                accessRoleArr.push(accessRoleObj);
            });
        const accessRoleRes = await AccessRole.insertMany(accessRoleArr);

        let policy = new RentalPolicy({
            projectTeamId: projectTeamId,
            shareTickets: req.body.issuesShareWith,
            shareTicketsWithRole: issuesShareRoleIdsArr,
            shareDocs: req.body.docShareWith,
            shareDocsWithRole: docsShareRoleIdsArr,
            chat: req.body.msgWith,
            chatWithRole: msgWithRoleIdsArr,
        });

        policy = await policy.save();

        res.status(200).json({
            policy: policy,
            error: false,
        });
    } catch (error) {
        res.status(400).json({
            policy: null,
            error: error,
        });
        throw new Error(error);
    }
};
const getPolicyByTeam = async (req, res) => {
    try {
        let projectTeamId = req.body.projectTeamId;
        let policy = await RentalPolicy.find({projectTeamId: projectTeamId})
            .populate({
                path: "chat",
                select: "parent parentModelName role user",
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
                path: "chatWithRole",
                select: "parent parentModelName role user",
                populate: {
                    path: "user",
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
                },
            })
            .populate({
                path: "shareDocs",
                select: "parent parentModelName role user",
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
                path: "shareDocsWithRole",
                select: "parent parentModelName role user",
                populate: {
                    path: "user",
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
                },
            })
            .populate({
                path: "shareTicketsWithRole",
                select: "parent parentModelName role user",
                populate: {
                    path: "user",
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
                },
            })
            .populate({
                path: "shareTickets",
                select: "parent parentModelName role user",
                populate: {
                    path: "parent",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            });
        res.status(200).json({
            policy: policy,
            error: null,
        });
    } catch (error) {
        res.status(400).json({
            policy: null,
            error: error,
        });
        throw new Error(error);
    }
};
const updatePolicy = async (req, res) => {
    try {
        // original: originalRes,
        // issuesShareWithRole: issuesShareWithRole,
        // docShareWithRole: docShareWithRole,
        // msgWithRole: msgWithRole,
        // projectTeamId: projectTeamId,
        let policyObj = req.body.policyObj;
        let projectTeamId = policyObj.projectTeamId;
        let msgWithArr = policyObj.msgWithRole;
        let docsShareWithArr = policyObj.docShareWithRole;
        let issuesShareWithArr = policyObj.issuesShareWithRole;
        let deleteRoles = policyObj.deleteRoles; // contains ids of deleted access role objects
        let original = policyObj.original;
        let newDocBody = [];
        let newMsgBody = [];
        let newIssueBody = [];
        let accessRoleArr = [];
        let updateAccessRoleArr = [];

        docsShareWithArr.length > 0 &&
            docsShareWithArr.map(obj => {
                if (obj?._id) {
                    // this entry was present previously. Check for any chnages and update access role
                    let originalObj = (original?.shareDocsWithRole || []).filter(DocObj => {
                        return DocObj?._id == obj?._id;
                    });
                    if (originalObj.length == 0) {
                        // this should not happen but if atomicity is not present then create new obj for same
                        const accessRoleObj = new AccessRole({
                            user: obj?.user?._id,
                            role: obj?.role,
                            parent: projectTeamId,
                            parentModelName: "Team",
                            creator: policyObj.user,
                        });
                        newDocBody.push(accessRoleObj?._id);
                        accessRoleArr.push(accessRoleObj);
                    } else {
                        //check for changes made in role
                        newDocBody.push(obj?._id);
                        if (originalObj[0].role != obj.role) {
                            updateAccessRoleArr.push(obj);
                        }
                    }
                } else {
                    // this is a new entry
                    //has user and role
                    const accessRoleObj = new AccessRole({
                        user: obj?.user?._id,
                        role: obj?.role,
                        parent: projectTeamId,
                        parentModelName: "Team",
                        creator: policyObj.user,
                    });
                    newDocBody.push(accessRoleObj?._id);
                    accessRoleArr.push(accessRoleObj);
                }
            });
        msgWithArr.length > 0 &&
            msgWithArr.map(obj => {
                if (obj?._id) {
                    // this entry was present previously. Check for any chnages and update access role
                    let originalObj = (original?.chatWithRole || []).filter(DocObj => {
                        return DocObj?._id == obj?._id;
                    });
                    if (originalObj.length == 0) {
                        // this should not happen but if atomicity is not present then create new obj for same
                        const accessRoleObj = new AccessRole({
                            user: obj?.user?._id,
                            role: obj?.role,
                            parent: projectTeamId,
                            parentModelName: "Team",
                            creator: policyObj.user,
                        });
                        newMsgBody.push(accessRoleObj?._id);
                        accessRoleArr.push(accessRoleObj);
                    } else {
                        //check for changes made in role
                        newMsgBody.push(obj?._id);
                        if (originalObj[0].role != obj.role) {
                            updateAccessRoleArr.push(obj);
                        }
                    }
                } else {
                    // this is a new entry
                    //has user and role
                    const accessRoleObj = new AccessRole({
                        user: obj?.user?._id,
                        role: obj?.role,
                        parent: projectTeamId,
                        parentModelName: "Team",
                        creator: policyObj.user,
                    });
                    newMsgBody.push(accessRoleObj?._id);
                    accessRoleArr.push(accessRoleObj);
                }
            });
        issuesShareWithArr.length > 0 &&
            issuesShareWithArr.map(obj => {
                if (obj?._id) {
                    // this entry was present previously. Check for any chnages and update access role
                    let originalObj = (original?.shareTicketsWithRole || []).filter(DocObj => {
                        return DocObj?._id == obj?._id;
                    });
                    if (originalObj.length == 0) {
                        // this should not happen but if atomicity is not present then create new obj for same
                        const accessRoleObj = new AccessRole({
                            user: obj?.user?._id,
                            role: obj?.role,
                            parent: projectTeamId,
                            parentModelName: "Team",
                            creator: policyObj.user,
                        });
                        newIssueBody.push(accessRoleObj?._id);
                        accessRoleArr.push(accessRoleObj);
                    } else {
                        //check for changes made in role
                        newIssueBody.push(obj?._id);
                        if (originalObj[0].role != obj.role) {
                            updateAccessRoleArr.push(obj);
                        }
                    }
                } else {
                    // this is a new entry
                    //has user and role
                    const accessRoleObj = new AccessRole({
                        user: obj?.user?._id,
                        role: obj?.role,
                        parent: projectTeamId,
                        parentModelName: "Team",
                        creator: policyObj.user,
                    });
                    newIssueBody.push(accessRoleObj?._id);
                    accessRoleArr.push(accessRoleObj);
                }
            });

        // msgWithArr.length > 0 &&
        //     msgWithArr.map(msgWith => {
        //         const accessRoleObj = new AccessRole({
        //             user: msgWith.user,
        //             role: msgWith.role,
        //             parentModelName: "RentalRelation",
        //             creator: policyObj.user,
        //         });
        //         msgWithRoleIdsArr.push(accessRoleObj._id);
        //         accessRoleArr.push(accessRoleObj);
        //     });

        // docsShareWithArr.length > 0 &&
        //     docsShareWithArr.map(docsWith => {
        //         const accessRoleObj = new AccessRole({
        //             user: docsWith.user,
        //             role: docsWith.role,
        //             parentModelName: "RentalRelation",
        //             creator: policyObj.user,
        //         });
        //         docsShareRoleIdsArr.push(accessRoleObj._id);
        //         accessRoleArr.push(accessRoleObj);
        //     });

        // issuesShareWithArr.length > 0 &&
        //     issuesShareWithArr.map(issuesWith => {
        //         const accessRoleObj = new AccessRole({
        //             user: issuesWith.user,
        //             role: issuesWith.role,
        //             parentModelName: "RentalRelation",
        //             creator: req.body.user,
        //         });
        //         issuesShareRoleIdsArr.push(accessRoleObj._id);
        //         accessRoleArr.push(accessRoleObj);
        //     });

        // adding new roles to db
        const accessRoleRes = await AccessRole.insertMany(accessRoleArr);

        // delete the deleted entries
        if (deleteRoles.length > 0) {
            AccessRole.deleteMany({_id: {$in: deleteRoles}});
        }

        //updating docs
        if (updateAccessRoleArr.length > 0) {
            var bulkUpdateOps = updateAccessRoleArr.map(obj => {
                return {
                    updateOne: {
                        filter: {_id: obj?._id},
                        update: obj,
                    },
                };
            });
            AccessRole.bulkWrite(bulkUpdateOps, {ordered: true, w: 1}, function (err, result) {
                if (err) {
                    throw new Error(err);
                }
            });
        }

        const policy = await RentalPolicy.findOneAndUpdate(
            {projectTeamId: projectTeamId},
            {
                shareTicketsWithRole: newIssueBody,
                shareDocsWithRole: newDocBody,
                chatWithRole: newMsgBody,
            },
            {
                returnNewDocument: true,
            }
        );
        res.status(200).json({
            policy: policy,
            error: false,
        });
    } catch (error) {
        res.status(400).json({
            policy: null,
            error: error,
        });
        throw new Error(error);
    }
};
module.exports = {
    createRentalPolicy,
    getPolicyByTeam,
    updatePolicy,
};
