const Doc = require("../models/doc.model");
const DocFolder = require("../models/doc.folder.model");
const Team = require("../models/team.model");
const Profile = require("../models/profile.model");
var async = require("async");
const teamProjectSocket = require("../services/team.project.socket");
var _ = require("../helpers/array.utils");
const ObjectId = require("mongoose").Types.ObjectId;

const getFolders = async (req, res) => {
    const profileId = req.body.profileId;

    try {
        if (ObjectId.isValid(profileId)) {
            let queries = [{profile: profileId}];
            queries.push({shared: {$in: [profileId]}});

            const docFolders = await DocFolder.find({
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
                    path: "shared",
                    select: "parent parentModelName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                // sorting the folder according to title
                .sort({title: 1})
                .collation({locale: "en", caseLevel: true});

            res.status(200).json({
                data: docFolders,
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

const getFolderDetail = async (req, res) => {
    const folderId = req.body.folderId;

    try {
        if (ObjectId.isValid(folderId)) {
            const folder = await DocFolder.findById(folderId)
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
                });

            res.status(200).json({
                data: folder,
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

const createFolder = async (req, res) => {
    try {
        var docFolder = new DocFolder(req.body);
        let profile = new Profile({
            parent: docFolder._id,
            parentModelName: "DocFolder",
        });

        await profile.save();
        docFolder.profile = profile._id;

        await docFolder.save();

        res.status(200).json({
            data: docFolder,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const updateFolder = (req, res) => {
    var docFolderObject = req.body;
    var docFolderId = docFolderObject._id;

    DocFolder.findByIdAndUpdate(docFolderId, docFolderObject, {new: true}, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            res.json(resp);
        }
    });
};

module.exports = {
    getFolders,
    getFolderDetail,
    createFolder,
    updateFolder,
};
