const Organization = require("../models/organization.model");
const File = require("../models/file.model");
const Team = require("../models/team.model");
const Profile = require("../models/profile.model");
const TaskMap = require("../models/task.map.model");
const { create: createWallet } = require("./accounting/wallet.controller");

const async = require("async");

var imagePath =
    "https://firebasestorage.googleapis.com/v0/b/contractflo.appspot.com/o/company.png?alt=media&token=357e859b-cd94-4ddb-9407-bcda8b79bce7";

const create = async (req, res) => {

    let fileId

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

    var organization = new Organization({
        ...req.body,
        displayPicture: fileId
    });

    var profile = false;

    profile = new Profile({
        parent: organization._id,
        parentModelName: "Organization",
        public: req.body.public,
    });

    await profile.save();
    organization.profile = profile._id;



    var team = new Team({
        parentTeam: req.body.parentTeam || null,
        ancestors: req.body.ancestors || [],
        parent: organization._id,
        parentModelName: "Organization",
        participants: req.body.participants,
        user: req.body.user,
    });

    if (req.body.taskMap) {
        team.taskMap = req.body.taskMap;
    } else {
        var taskMap = new TaskMap({});
        await taskMap.save();
        team.taskMap = taskMap._id;
    }

    const name = req?.body?.displayName || "";
    const email = req?.body?.email || "";
    const address = req?.body?.address || {};

    const wallet = await createWallet(team._id, "Team", email, name, address);

    const walletId = wallet._id;
    team.wallet = walletId;

    organization.wallet = walletId;
    organization.team = team._id;

    const participants = req.body.participants;

    if (participants.length > 0) {
        participants.map(memberId => {
            var permissionPath = "permissions." + memberId;
            team.set(permissionPath, "Owner");
        });
    }

    await organization.save();
    var savedteam = await team.save();
    savedteam.parent = organization;

    const teamId = savedteam._id

    await Team.findById(teamId)
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

            res.json({ team: reStructuredTeam, profile });
        });
};

const goPublic = async (req, res) => {
    var orgId = req.body.orgId;
    profile = new Profile({
        parent: orgId,
        parentModelName: "Organization",
    });

    await profile.save();

    var orgObject = {
        _id: orgId,
        public: true,
        profile: profile._id,
    };

    Organization.findByIdAndUpdate(orgId, orgObject, { new: true }, function (err, org) {
        if (err) {
            console.log(err);
        } else {
            console.log(org);
            res.json({
                org,
                profile,
            });
        }
    });
};

const getDetail = (req, res) => {
    const orgId = req.body.orgId;

    Organization.findById(orgId)
        .populate("team")
        .populate("profile")
        .then(org => {
            res.json({
                org,
            });
        });
};

const update = (req, res) => {
    var orgObject = req.body;
    var orgId = orgObject._id;

    Organization.findByIdAndUpdate(orgId, orgObject, { new: true }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            res.json(resp);
        }
    });
};

const updateForTransaction = async (req, res) => {
    try {
        var orgObject = req.body;
        var orgId = orgObject._id;
        console.log(req.body, " is the orgObject");
        const updatedOrganization = await Organization.findByIdAndUpdate(orgId, orgObject, { new: true })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })

        res.json({
            status: "200",
            data: updatedOrganization,
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
    var orgObject = req.body;
    var orgId = orgObject._id;

    Organization.findByIdAndUpdate(orgId, orgObject, { new: true }, function (err, resp) {
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

                    res.status(200).json({
                        data: reStructuredTeam
                    });
                });
        }
    });
};

const getUserOrganizations = (req, res) => {
    Organization.find({ $or: [{ user: req.body.user }, { participants: { $in: [req.body.user] } }] })
        .populate({
            path: "displayPicture",
            model: "File",
            select: "url thumbUrl",
        })
        .populate([
            {
                path: "allTimeMembers.modelId",
                select: "name displayName wallet model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        ])
        .populate("basic")
        .then(organizations => {
            res.json(organizations);
        });
};

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|jfif|gif|svg)$/.test(url.toLowerCase());
}

const updatePicture = async (req, res) => {
    let orgId = req.body.orgId;
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
                    const org = await Organization.findByIdAndUpdate(orgId, { cover: fileId }, { new: true });
                    org.cover = file;
                    console.log(org);
                } else {
                    const org = await Organization.findByIdAndUpdate(orgId, { displayPicture: fileId }, { new: true });
                    org.displayPicture = file;
                    console.log(org);
                }
                res.status(200).json({ data: file });
            } else {
                console.log("Its not an image");
            }
        }
    });
};

const updateOrgInfo = async (req, res) => {
    let orgId = req.body.orgId;
    let orgData = req.body.orgInfo;
    console.log(orgData);
    Organization.findOneAndUpdate({ _id: orgId }, { ...orgData }, { new: true }, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Organization Data Updated!");
            res.json({
                status: 200,
                data: docs,
            });
        }
    });
};

const updateOrgInfoArray = async (req, res) => {
    let orgId = req.body.orgId;
    let orgData = req.body.orgInfo;
    let arrayName = req.body.arrayName;
    Organization.findOneAndUpdate({ _id: orgId }, { $addToSet: { [arrayName]: orgData } }, { new: true }, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Organization Data Updated!");
            console.log(docs);
            res.json({
                status: 200,
                data: docs,
            });
        }
    });
};

const editOrgInfoArray = async (req, res) => {
    let arrayId = req.body.arrayId;
    let arrayObj = req.body.arrayObj;
    let arrayName = req.body.arrayName;
    console.log(arrayObj);
    console.log(arrayName);
    console.log(arrayId);
    let searchProperty = arrayName + "._id";
    let setProperty = arrayName + ".$";
    Organization.findOneAndUpdate(
        {
            [searchProperty]: arrayId,
        },
        {
            $set: {
                [setProperty]: arrayObj,
            },
        },
        { new: true },
        (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                console.log(docs);
                console.log(arrayName + " Array Updated");
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        }
    );
};

const deleteOrgArrayItem = async (req, res) => {
    let orgId = req.body.orgId;
    let arrayObjId = req.body.arrayObjId;
    let arrayName = req.body.arrayName;
    try {
        Organization.findOneAndUpdate(
            { _id: orgId },
            { $pull: { [arrayName]: { _id: arrayObjId } } },
            { new: true },
            (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log(arrayName + " Object Deleted!");
                    res.json({
                        status: 200,
                        data: docs,
                    });
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

const deleteOrgProjectPic = (req, res) => {
    let orgId = req.body.orgId;
    let projectId = req.body.projectId;
    let fileId = req.body.fileId;
    console.log("orgId: " + orgId + "ProjectId: " + projectId + "FileId: " + fileId);
    try {
        Organization.findOneAndUpdate(
            { _id: orgId, "projects._id": projectId },
            { $pull: { "projects.$.pictures": fileId } },
            {
                new: true,
            },
            (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Picture Deleted!");
                    res.json({
                        status: 200,
                        data: docs,
                    });
                    File.findOneAndUpdate(
                        {
                            _id: fileId,
                        },
                        {
                            $set: {
                                deleted: true,
                            },
                        },
                        { new: true },
                        (err, docs) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log(docs);
                                console.log("File delete flag Updated");
                            }
                        }
                    );
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

const updateFileOnDeletion = (req, res) => {
    let fileId = req.body.fileId;
    File.findOneAndUpdate(
        {
            _id: fileId,
        },
        {
            $set: {
                deleted: true,
            },
        },
        { new: true },
        (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                console.log(docs);
                console.log("File delete flag Updated");
            }
        }
    );
};

module.exports = {
    create,
    update,
    newUpdate,
    getDetail,
    goPublic,
    getUserOrganizations,
    updatePicture,
    updateOrgInfo,
    updateOrgInfoArray,
    editOrgInfoArray,
    deleteOrgArrayItem,
    deleteOrgProjectPic,
    updateFileOnDeletion,
    updateForTransaction
};
