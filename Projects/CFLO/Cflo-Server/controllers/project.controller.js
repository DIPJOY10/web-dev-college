const Project = require("../models/project.model");
const Profile = require("../models/profile.model");
const File = require("../models/file.model");
const Team = require("../models/team.model");
const TopProjectInfo = require("../models/top.project.info");
const TaskMap = require("../models/task.map.model");
const { create: createWallet } = require("./accounting/wallet.controller");
const _ = require("lodash");
const async = require("async");
const { sampleTask } = require("../controllers/task.controller");
const rePrimary = require("../helpers/property.type");
const { forEach } = require("lodash");

var imagePath = "https://i.ibb.co/L87QjS5/msproject.png";

const getData = async (req, res) => {
    res.json({
        status: 200,
        data: rePrimary,
    });
};

const getAdminProjects = async (req, res) => {
    try {
        const adminProfileIds = req.body.adminProfileIds;

        const projectTeams = await Team.find({
            participants: { $in: adminProfileIds },
            parentModelName: "Project",
        })
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address images",
                populate: {
                    path: "images",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address images salesCompsId",
                populate: {
                    path: "salesCompsId",
                    model: "SalesComps",
                },
            })
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address images rentCompsId",
                populate: {
                    path: "rentCompsId",
                    model: "RentComps",
                },
            })
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address images rentEstimateId",
                populate: {
                    path: "rentEstimateId",
                    model: "RentEstimateComps",
                },
            })
            .populate({
                path: "parent",
                populate: {
                    path: "ownerProfile",
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
                }
            })

        res.status(200).json({
            data: projectTeams,
        });
    } catch (error) {
        res.status(200).json({
            data: [],
        });
    }
};

const savePropertyDesc = async (req, res) => {
    var descObj = new Project(req.body);
    var item = await descObj.save();
};

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|jfif|gif|svg)$/.test(url.toLowerCase());
}

const updatePicture = async (req, res) => {
    let projId = req.body.projId;
    let fileId = req.body.fileId;
    let fileType = req.body.fileType;
    console.log(req.body);
    console.log("Hello");

    File.findById(fileId, async (err, file) => {
        if (err) {
            console.log(err);
        } else {
            if (isImage(file?.url)) {
                if (fileType === "Cover") {
                    const proj = await Project.findByIdAndUpdate(projId, { cover: fileId }, { new: true });
                    proj.cover = file;
                    console.log(proj);
                } else {
                    const proj = await Project.findByIdAndUpdate(projId, { displayPicture: fileId }, { new: true });
                    proj.displayPicture = file;
                    console.log(proj);
                }
                res.status(200).json({ data: file });
            } else {
                console.log("Its not an image");
            }
        }
    });
};

const updateData = async (req, res) => {
    try {
        let descObj = req.body;
        const docs = await Project.findOneAndUpdate({ team: descObj.team }, { ...descObj }, { new: true })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "images",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "salesCompsId",
                model: "SalesComps",
            })
            .populate({
                path: "rentCompsId",
                model: "RentComps",
            })
            .populate({
                path: "rentEstimateId",
                model: "RentEstimateComps",
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Rental",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "BRRRR",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Flip",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "ownerProfile",
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
                }
            })

        res.json({
            status: 200,
            data: docs,
        });

    } catch (error) {
        console.log(error);
    }
};

const getProjectByTeamId = async (req, res) => {
    try {
        let teamId = req.body.teamId;
        // console.log(teamId);
        const projectData = await Project.findOne({ team: teamId })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "images",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "salesCompsId",
                model: "SalesComps",
            })
            .populate({
                path: "rentCompsId",
                model: "RentComps",
            })
            .populate({
                path: "rentEstimateId",
                model: "RentEstimateComps",
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Rental",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "BRRRR",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Flip",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "ownerProfile",
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
                }
            })

        if (projectData) {
            res.json({
                status: 200,
                data: projectData,
            });
            // console.log(projectData);
        }
    } catch (error) {
        res.json({
            status: 400,
            data: null,
        });
    }
};

const getTopProjectInfo = (req, res) => {
    var infoId = req.body.infoId;

    TopProjectInfo.findById(infoId)
        .populate("owner")
        .then(topInfo => {
            res.json(topInfo);
        });
};

const searchProject = async (req, res) => {
    try {
        var name = new RegExp(req.body.name, "ig");

        const queries = [{ displayName: name }, { description: name }];

        const projects = await Team.find({
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
                match: { displayName: name },
            });

        res.json({
            status: 200,
            data: projects,
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

const create = async (req, res) => {
    try {

        console.log(req.body)

        let fileId

        console.log(req.body)

        if (req.body.displayPicture) {
            fileId = req.body.displayPicture
        } else {
            const file = new File({
                uploadStatus: "success",
                fileUsage: "Image",
                storage: "firebase",
                url: imagePath,
                thumbUrl: imagePath,
            });

            await file.save();
            fileId = file._id
        }

        var project = new Project({
            ...req.body,
            displayPicture: fileId,
        });

        var profile = new Profile({
            parent: project._id,
            parentModelName: "Project",
        });

        await profile.save();
        project.profile = profile._id;

        var team = new Team({
            parentTeam: req.body.parentTeam || null,
            ancestors: req.body.ancestors || [],
            parent: project._id,
            parentModelName: "Project",
            user: req.body.user,
            participants: req.body.participants,
        });

        if (req.body.taskMap) {
            team.taskMap = req.body.taskMap;
            team.topProjectInfo = req.body.topProjectInfo;
            team.wallet = req.body.wallet;
        } else {
            var topProjectInfo = new TopProjectInfo({
                owner: req.body.owner,
                ownerModelName: req.body.ownerModelName,
                topProjectTeam: team._id,
            });
            var taskMap = new TaskMap({});
            await taskMap.save();

            await topProjectInfo.save();
            team.topProjectInfo = topProjectInfo._id;
            team.taskMap = taskMap._id;

            const name = req.body.displayName || "";
            const email = req?.body?.email || "";
            const address = req?.body?.address || {};

            const wallet = await createWallet(team._id, "Team", email, name, address);

            const walletId = wallet._id;
            team.wallet = walletId;
            project.wallet = walletId;
            project.email = email;
        }

        const participants = req.body.participants;
        let userProfile;
        if (participants.length > 0) {
            userProfile = participants[0];
        }
        var permissionPath = "permissions." + userProfile;
        team.set(permissionPath, "Owner");

        project.team = team._id;
        project.save().then(project => {
            team.save().then(team => {
                Team.findById(team._id)
                    .populate({
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        }
                    })
                    .populate({
                        path: "parent",
                        populate: {
                            path: "images",
                            model: "File",
                            select: "url thumbUrl",
                        }
                    })
                    .populate({
                        path: "parent",
                        populate: {
                            path: "salesCompsId",
                            model: "SalesComps",
                        }
                    })
                    .populate({
                        path: "parent",
                        populate: {
                            path: "rentCompsId",
                            model: "RentComps",
                        }
                    })
                    .populate({
                        path: "parent",
                        populate: {
                            path: "rentEstimateId",
                            model: "RentEstimateComps",
                        }
                    })
                    .populate({
                        path: "parent",
                        populate: {
                            path: "basic",
                        }
                    })
                    .populate({
                        path: "allTimeMembers.modelId",
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    })
                    .populate({
                        path: "participants",
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
                        path: "parent",
                        populate: [
                            {
                                path: "project",
                                model: "Project",
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        ],
                    })
                    .populate({
                        path: "parent",
                        populate: {
                            path: "ownerProfile",
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
                        }
                    })
                    .then(team => {
                        // team.parent.displayPicture = file;
                        let participantIds = []
                        let participants = team.participants

                        participants.map((participant) => {
                            participantIds.push(participant._id)
                        })

                        const reStructuredTeam = {
                            ...team._doc,
                            participants: participantIds,
                            populatedParticipants: participants
                        }

                        res.json(reStructuredTeam);
                    });
            });
        });
    } catch (err) {
        console.log("err err", err);
        res.json({
            status: "400",
            data: null,
            err
        });
    }
};

const createBranch = async (req, res) => {
    const file = new File({
        uploadStatus: "success",
        fileUsage: "Image",
        storage: "firebase",
        url: imagePath,
        thumbUrl: imagePath,
    });

    await file.save();

    var project = new Project({
        ...req.body,
        displayPicture: file._id,
    });

    var team = new Team({
        parentTeam: req.body.parentTeam || null,
        ancestors: req.body.ancestors || [],
        parent: project._id,
        parentModelName: "Project",
        user: req.body.user,
        participants: req.body.participants,
    });

    if (req.body.taskMap) {
        team.taskMap = req.body.taskMap;
        team.topProjectInfo = req.body.topProjectInfo;
        team.wallet = req.body.wallet;
    }

    var permissionPath = "permissions." + project.user;
    team.set(permissionPath, "Owner");

    project.team = team._id;
    project.save().then(project => {
        team.save().then(team => {
            Team.findById(team._id)
                .populate({
                    path: "allTimeMembers.modelId",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "allTimeMembers.modelId",
                    select: "name displayName wallet model images",
                    populate: {
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "parent",
                    populate: [
                        {
                            path: "project",
                            model: "Project",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    ],
                })
                .then(team => {
                    team.parent.displayPicture = file;
                    res.json(team);
                });
        });
    });
};

const sample = async (req, res) => {
    var user = req.body.user

    const file = new File({
        uploadStatus: "success",
        fileUsage: "Image",
        storage: "firebase",
        url: imagePath,
        thumbUrl: imagePath,
    });

    await file.save();

    var project = new Project({
        ...req.body,
        displayPicture: file._id,
        ownerModelName: "User",
        ownerProfile: req.body.userProfile
    });

    var team = new Team({
        parentTeam: req.body.parentTeam || null,
        ancestors: req.body.ancestors || [],
        parent: project._id,
        parentModelName: "Project",
        participants: req.body.participants,
        allTimeMembers: req.body.allTimeMembers,
    });

    if (req.body.taskMap) {
        team.taskMap = req.body.taskMap;
        team.topProjectInfo = req.body.TopProjectInfo;
    } else {
        var topProjectInfo = new TopProjectInfo({
            owner: req.body.owner,
            ownerModelName: req.body.ownerModelName,
            topProjectTeam: team._id,
        });
        var taskMap = new TaskMap({});
        await taskMap.save();

        await topProjectInfo.save();
        team.topProjectInfo = topProjectInfo._id;
        team.taskMap = taskMap._id;
    }

    const wallet = await createWallet(team._id, "Team");
    const walletId = wallet._id;
    team.wallet = walletId;
    var permissionPath = "permissions." + project.user;
    team.set(permissionPath, "Owner");

    project.team = team._id;
    project.save().then(project => {
        team.save().then(team => {
            Team.findById(team._id)
                .populate({
                    path: "allTimeMembers.modelId",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "allTimeMembers.modelId",
                    select: "name displayName wallet model images",
                    populate: {
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "parent",
                    populate: [{ path: "project", model: "Project" }],
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "basic",
                    }
                })
                .populate({
                    path: "allTimeMembers.modelId",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "participants",
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
                    path: "parent",
                    populate: [
                        {
                            path: "project",
                            model: "Project",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    ],
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "ownerProfile",
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
                    }
                })
                .then(team => {
                    sampleTask(team);
                    res.json(team);
                });
        });
    });
};

const findOrCreateSample = (req, res) => {
    var user = req.body.user;
    Team.find({ user: user, parentModelName: "Project" }).then(teams => {
        if (teams.length > 0) {
            res.json(teams[0]);
        } else {
            sample(req, res);
        }
    });
};

const update = async (req, res) => {
    var projectObject = req.body;
    var projectId = projectObject._id;

    return Project.findByIdAndUpdate(projectId, projectObject, { new: true }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            res.json(resp);
        }
    });
};

const updateForTransaction = async (req, res) => {
    try {
        var projectObject = req.body;
        var projectId = projectObject._id;
        console.log(req.body, " is the projectObject");
        const updatedProject = await Project.findByIdAndUpdate(projectId, projectObject, { new: true })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "images",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "salesCompsId",
                model: "SalesComps",
            })
            .populate({
                path: "rentCompsId",
                model: "RentComps",
            })
            .populate({
                path: "rentEstimateId",
                model: "RentEstimateComps",
            })
            .populate({
                path: "ownerProfile",
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
                }
            })

        res.json({
            status: "200",
            data: updatedProject,
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

const newUpdate = async (req, res) => {
    var projectObject = req.body;
    var projectId = projectObject._id;
    console.log(req.body, " is the projectObject");
    return Project.findByIdAndUpdate(projectId, projectObject, { new: true }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            const teamId = resp.team
            Team.findById(teamId)
                .populate({
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "salesCompsId",
                        model: "SalesComps",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "rentCompsId",
                        model: "RentComps",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "rentEstimateId",
                        model: "RentEstimateComps",
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "basic",
                    }
                })
                .populate({
                    path: "allTimeMembers.modelId",
                    select: "name displayName wallet model",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "participants",
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
                    path: "parent",
                    populate: [
                        {
                            path: "project",
                            model: "Project",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    ],
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Rental",
                            model: "PurchaseCriteria",
                        }
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "BRRRR",
                            model: "PurchaseCriteria",
                        }
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Flip",
                            model: "PurchaseCriteria",
                        }
                    }
                })
                .populate({
                    path: "parent",
                    populate: {
                        path: "ownerProfile",
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
                    }
                })
                .then(team => {
                    // team.parent.displayPicture = file;
                    let participantIds = []
                    let participants = team.participants

                    participants.map((participant) => {
                        participantIds.push(participant._id)
                    })

                    const reStructuredTeam = {
                        ...team._doc,
                        participants: participantIds,
                        populatedParticipants: participants
                    }

                    res.status(200).json({
                        data: reStructuredTeam
                    });
                });
        }
    });
};

const updateProjectWithPopulate = async (req, res) => {
    try {
        var projectObject = req.body;
        var projectId = projectObject._id;

        const updatedProject = await Project.findByIdAndUpdate(projectId, projectObject, { new: true })
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
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "images",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "salesCompsId",
                model: "SalesComps",
            })
            .populate({
                path: "rentCompsId",
                model: "RentComps",
            })
            .populate({
                path: "rentEstimateId",
                model: "RentEstimateComps",
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Rental",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "BRRRR",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Flip",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "ownerProfile",
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
                }
            })

        res.json({
            status: "200",
            data: updatedProject,
        });
    } catch (err) {
        res.json({
            status: "400",
            data: null,
            err,
        });
    }
};

const getProjectByIdCode = async (req, res) => {
    try {
        let projectIdCode = req.body.projectIdCode;

        let getProjects = await Project.find({ projectIdCode: projectIdCode }).select("projectIdCode");

        res.json({
            status: "200",
            data: getProjects,
        });
    } catch (err) {
        res.json({
            status: "400",
            data: null,
            err,
        });
    }
};

const getSortedProjects = (req, res) => {
    const teamIds = req.body.teamIds;
    async.map(
        teamIds,
        function (teamId, callback) {
            Team.find({ ancestors: { $in: [teamId] } })
                .then(teams => {
                    callback(null, { teamId, teams });
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

const getUserProject = (req, res) => {
    Project.find({ $or: [{ user: req.body.user }, { participants: { $in: [req.body.user] } }] })
        .populate({ path: "branches", model: "Branch" })
        .populate({
            path: "participants",
            model: "User",
            select: "name displayName wallet",
            populate: {
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            },
        })
        .populate({ path: "basic", model: "Basic", select: "title description numDocs amount" })
        .then(projects => {
            res.json(projects);
        })
        .catch(err => {
            console.log(err);
        });
};



const getAllAdminIdsHelper = async (userProfileId) => {
    let accessableOrgs = [];
    let adminProfileIds = [userProfileId];

    const orgTeams = await Team.find({
        participants: { $in: [userProfileId] },
        parentModelName: "Organization",
    })
        .populate({
            path: "parent",
            populate: [
                {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
                {
                    path: "cover",
                    model: "File",
                    select: "url thumbUrl",
                },
            ],
        })
        .populate({
            path: "participants",
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
        });

    orgTeams.map(team => {
        const perm = team.permissions;
        const role = perm.get(userProfileId);
        if (role == "Admin" || role == "Owner") {
            accessableOrgs.push(team);
            adminProfileIds.push(team?.parent?.profile);
        }
    });

    return {
        accessableOrgs,
        adminProfileIds,
    };
};





const getAccessibleProjects = async (req, res) => {
    try {
        const userProfileId = req.body.userProfileId;
        let accessableOrgsAndAdminIds = await getAllAdminIdsHelper(userProfileId);
        let accessableOrgs = accessableOrgsAndAdminIds.accessableOrgs;
        let adminIds = accessableOrgsAndAdminIds.adminProfileIds;


        const projectTeams = await Team.find({
            participants: { $in: adminIds },
            parentModelName: "Project",
        })
            .select("parent parentModelName")
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address",
                populate: {
                    path: "profile",
                    model: "Profile",
                    populate: {
                        path: "parent",
                        select: "displayPicture email displayName wallet",
                        populate: {
                            path: "wallet",
                            model: "Wallet",
                        },
                    },
                },
            })
            .populate({
                path: "parent",
                select: "name displayName profile team displayPicture address",
                populate: {
                    path: "profile",
                    model: "Profile",
                    populate: {
                        path: "parent",
                        select: "displayPicture email displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            })
            .populate("wallet");

        let usersAndPalArr = [];

        projectTeams.length > 0 &&
            projectTeams.map(project => {
                if (project?.parent?.profile?._id && project?.wallet?._id) {
                    const newObj = {
                        profileId: project?.parent?.profile?._id,
                        displayName: project?.parent?.displayName,
                        displayPicture: project?.parent?.displayPicture,
                        profile: project?.parent?.profile,
                        email: project?.parent?.email,
                        wallet: project?.wallet,
                    };
                    usersAndPalArr.push(newObj);
                }
            });

        if (usersAndPalArr.length > 0) {
            res.json({
                status: 200,
                data: usersAndPalArr,
            });
        }
    } catch (err) {
        console.log(err, " is the error");
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

module.exports = {
    getTopProjectInfo,
    getAdminProjects,
    sample,
    findOrCreateSample,
    create,
    createBranch,
    update,
    newUpdate,
    getSortedProjects,
    getUserProject,
    updatePicture,
    getData,
    savePropertyDesc,
    getProjectByTeamId,
    updateData,
    getAccessibleProjects,
    updateProjectWithPopulate,
    getProjectByIdCode,
    updateForTransaction,
    getAllAdminIdsHelper
};
