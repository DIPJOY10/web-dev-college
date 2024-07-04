const {ObjectId} = require("mongoose").Types.ObjectId;
const IssueProject = require("../models/issue.project.model");

const createIssueProject = (req, res) => {
    var issueProject = new IssueProject(req.body);
    try {
        issueProject
            .save()
            .then(project => {
                res.status(200).json({
                    data: project,
                    success: true,
                });
            })
            .catch(error => {
                res.status(400).json({
                    data: error,
                    success: false,
                });
            });
    } catch (error) {
        res.status(400).json({
            data: error,
            success: false,
        });
    }
};

const getAllIssueProjects = async (req, res) => {
    try {
        const profileId = req.body.profileId;
        if (ObjectId.isValid(profileId)) {
            let queries = [{profile: profileId}];
            queries.push({shared: {$in: [profileId]}});
            queries.push({assigned: {$in: [profileId]}});
            const issueProjects = await IssueProject.find({
                $or: queries,
            })
                .populate({
                    path: "units",
                    populate: {
                        path: "issue",
                        model: "Issue",
                        populate: {
                            path: "template",
                            model: "IssueTemplate",
                            populate: {
                                path: "pipeline",
                                model: "StatusItem",
                            },
                        },
                    },
                })
                .populate("profile")
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
                    path: "user",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                });
            res.status(200).json({
                data: issueProjects,
            });
        } else {
            res.status(400).json({
                data: null,
                error: "Not a valid id",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getIssueProject = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        if (ObjectId.isValid(projectId)) {
            const issueProjects = await IssueProject.find({
                _id: projectId,
            })
                .populate({
                    path: "units",
                    populate: {
                        path: "issue",
                        model: "Issue",
                        populate: {
                            path: "template",
                            model: "IssueTemplate",
                            populate: {
                                path: "pipeline",
                                model: "StatusItem",
                            },
                        },
                    },
                })
                .populate("profile")
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
                    path: "user",
                    select: "name displayName model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                });
            res.status(200).json({
                data: issueProjects,
                success: true,
            });
        } else {
            res.status(400).json({
                data: "Not a valid id",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({
            data: error,
            success: false,
        });
    }
};

const updateIssueProject = async (req, res) => {
    var projectId = req.body._id;
    var projectObj = req.body;
    IssueProject.findByIdAndUpdate(projectId, projectObj, {new: true}, function (err, resp) {
        if (err) {
            res.status(400).json({
                data: err,
                success: false,
            });
        } else {
            res.status(200).json({
                data: null,
                success: true,
            });
        }
    });
};

//update delete function and remove issue unit model
const deleteProject = async (req, res) => {
    var _id = req.body._id;
    try {
        await IssueProject.findByIdAndRemove(_id, async function (err, resp) {
            console.log(resp);
            if (err) {
                console.log(err);
                res.status(400).json({
                    data: err,
                    success: false,
                });
            } else {
                res.status(200).json({
                    data: null,
                    success: true,
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            data: error,
            success: false,
        });
    }
};

module.exports = {
    createIssueProject,
    getAllIssueProjects,
    getIssueProject,
    updateIssueProject,
    deleteProject,
};
