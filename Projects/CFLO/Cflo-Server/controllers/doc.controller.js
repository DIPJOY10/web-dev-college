const Doc = require("../models/doc.model");
const Team = require("../models/team.model");
const Task = require("../models/task.model");
const doc = require("../models/doc.model");
const Investment = require("../models/investment.model");
const DocFolder = require("../models/doc.folder.model");
const { Discussion, Comment } = require("../models/commentAndDiscussion");
var _ = require("lodash");
var async = require("async");
const teamProjectSocket = require("../services/team.project.socket");
const DocDraft = require("../models/doc.draft.model");
const ObjectId = require("mongoose").Types.ObjectId;
const { create: createActivity } = require("./activity.controller");
const getDocs = async (req, res) => {
    const profileId = req.body.profileId;

    try {
        if (ObjectId.isValid(profileId)) {
            let queries = [{ profile: profileId }];
            queries.push({ shared: { $in: [profileId] } });

            const docs = await Doc.find({
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
                // .populate({
                //     path: "shared",
                //     select: "name displayName wallet",
                //     populate: {
                //         path: "displayPicture",
                //         model: "File",
                //         select: "url thumbUrl",
                //     },
                // })
                .populate({
                    path: "shared",
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
                })// sorting the docs according to title
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
                }).populate('files')
                .sort({ title: 1 })
                .collation({ locale: "en", caseLevel: true });

            res.status(200).json({
                data: docs,
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

const create = async (req, res) => {
    try {
        var doc = new Doc(req.body);
        var newDoc = {
            title: req.body.title,
            description: req.body.description,
            files: req.body.files || [],
            links: req.body.links || [],
        };
        var doc1 = new Doc(newDoc);

        await doc1.save();
        doc.versions = [doc1._id];
        var draftDocBody = {
            title: req.body.title,
            description: req.body.description,
            parentDoc: doc._id,
            links: req.body.links || [],
        };
        var draft = new DocDraft(draftDocBody);
        await draft.save();
        await doc.save().then(doc => {
            const docId = doc._id;
            Doc.findById(docId)
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
                }).then((doc => {
                    console.log("data doc is ", doc);
                    createActivity(
                        req,
                        {
                            title: `${doc.user.displayName} created a document`,
                            body: doc.title,
                            type: "DocCreated",
                            data: docId,
                            dataModel: "Doc",
                            parent: doc?.parent,
                            parentModelName: doc?.parentModelName,
                            // notify: [doc?.parent],
                            user: doc.user._id,
                            profile: doc.profile._id,
                            raw: JSON.stringify(doc),
                        },
                        doc.assigned,
                        doc?.user?.profile
                    );
                    res.status(200).json({
                        data: doc,
                    });
                }));
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
}
const update = async (req, res) => {
    try {
        const docId = req.body._id;

        if (ObjectId.isValid(docId)) {
            var newDoc = {
                title: req.body.title,
                description: req.body.description,
                files: req.body.files,
                links: req.body.links || [],
                activeUserId: req.body.activeUserId,
                activeUserProfile: req.body.activeUserProfile,
                countryTag: req.body.countryTag,
                nationwide: req.body.nationwide,
                stateTags: req.body.stateTags,
                tagStrs: req.body.tagStrs,
                tags: req.body.tags,
                // shared:req.body.shared||[],
            };

            const docNew = new Doc(newDoc);
            await docNew.save();
            var draftDocBody = {
                title: req.body.title,
                description: req.body.description,
                changes: false,
                links: req.body.links || [],
            };
            const docNewId = docNew._id;
            var updateObj = {
                $addToSet: { versions: docNewId },
                ...newDoc,
            };

            const doc = await Doc.findByIdAndUpdate(docId, updateObj, { new: true }).then((doc) => {
                const docId = doc._id;
                Doc.findById(docId)
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
                    }).then((doc => {
                        createActivity(
                            req,
                            {
                                title: `${req.body.activeUserId.displayName} updated a document`,
                                body: doc.title,
                                type: "DocUpdated",
                                data: docId,
                                dataModel: "Doc",
                                parent: doc?.parent,
                                parentModelName: doc?.parentModelName,
                                // notify: [doc?.parent],
                                user: req?.body?.activeUserId,
                                profile: req?.body?.activeUserProfile,
                                raw: JSON.stringify(doc),
                            },
                            doc.assigned,
                            doc?.user?.profile
                        );
                        // console.log(activity,'activityDoc');
                        res.status(200).json({
                            // activity,
                            data: doc,
                        });
                    }));
            })
            const draft = await DocDraft.updateOne({ parentDoc: docId }, { $set: draftDocBody }, { upsert: true });

            // res.status(200).json({
            //     data: doc,
            // });
        } else {
            res.status(400).json({
                data: null,
                error: "Invalid Document ID",
            });
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getDraftDoc = async (req, res) => {
    let docId = req.body._id;
    try {
        const draft = await DocDraft.find({
            parentDoc: ObjectId(docId),
        })
            .then(obj => {
                res.status(200).json({
                    draft: obj,
                });
            })
            .catch(err => {
                res.status(400).json({
                    draft: null,
                    error: err,
                });
            });
    } catch (error) {
        res.status(400).json({
            draft: null,
            error: error,
        });
    }
};

const updateDraft = async (req, res) => {
    var docId = req.body._id;
    var draftDocBody = {
        title: req.body.title,
        description: req.body.description,
        changes: true,
        links: req.body.links || [],
    };
    try {
        const draft = await DocDraft.updateOne({ parentDoc: docId }, { $set: draftDocBody }, { upsert: true })
            .then(obj => {
                res.status(200).json({
                    updated: true,
                });
            })
            .catch(err => {
                res.status(400).json({
                    updated: false,
                    error: err,
                });
            });
    } catch (error) {
        res.status(400).json({
            updated: false,
            error: error,
        });
    }
};

const deleteDoc = (req, res) => {
    var docId = req.body.docId;
    Doc.findByIdAndDelete(docId)
        .then(result => {
            res.status(200).json({
                data: result,
            });
        })
        .catch(err => {
            res.status(400).json({
                data: null,
            });
        });
};

const getDocAndFolders = async (req, res) => {
    try {
        const profile = req.body.profile;

        if (ObjectId.isValid(profile)) {
            const queries = req.body.profile ? [{ profile: req.body.profile }] : [];
            queries.push({
                shared: { $in: [profile] },
            });

            const docs = Doc.find({
                $or: queries,
            }).populate("files");

            const folders = DocFolder.find({
                $or: queries,
            });

            const promises = [docs, folders];

            Promise.allSettled(promises).then(results => {
                const docResults = results[0].value;
                const foldersResults = results[1].value;

                res.status(200).json({
                    data: {
                        docs: docResults,
                        folders: foldersResults,
                    },
                });
            });
        } else {
            res.status(400).json({
                data: null,
                error: error,
            });
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};
const getDocDetail = async (req, res) => {
    const docId = req.body.docId;
    console.log("doc id is : ", docId);

    try {
        if (ObjectId.isValid(docId)) {
            const docs = await Doc.find({
                _id: ObjectId(docId),
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
                .populate({
                    path: "tags",
                    model: "Category",
                    populate: {
                        path: "parent",
                        model: "Category",
                    }
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
            console.log("doc details ,", docs);
            res.status(200).json({
                data: docs,
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

const getDocDetailWithPopulatedFiles = async (req, res) => {
    const docId = req.body.docId;
    console.log("doc id is : ", docId);

    try {
        if (ObjectId.isValid(docId)) {
            const docs = await Doc.find({
                _id: ObjectId(docId),
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
                .populate({
                    path: "tags",
                    model: "Category",
                    populate: {
                        path: "parent",
                        model: "Category",
                    }
                })
                .populate({
                    path: "files",
                    model: "File",
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
            console.log("doc details ,", docs);
            res.status(200).json({
                data: docs,
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

const getDocAllVersions = async (req, res) => {
    // console.log("body is ,", req.body);
    const versions = req.body.versions;
    const searchIds = [];
    try {
        versions.forEach(id => {
            searchIds.push(ObjectId(id));
        });
    } catch (err) {
        console.log("versions array was empty in doc.controller getdocallversions");
    }
    // console.log("versions ", versions, searchIds);

    try {
        if (ObjectId.isValid(versions[0])) {
            const docs = await Doc.find({
                _id: { $in: searchIds },
            });
            res.status(200).json({
                data: docs,
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

const simpleDocUpdate = async (req, res) => {
    try {
        const newDoc = req.body
        const docId = newDoc._id;
        const doc = await Doc.findByIdAndUpdate(docId, newDoc, { new: true })
            .populate('files')
        res.status(200).json({
            data: doc
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })

    }
}

module.exports = {
    getDocs,
    getDocDetail,
    getDocDetailWithPopulatedFiles,
    create,
    update,
    simpleDocUpdate,
    deleteDoc,
    getDocAndFolders,
    getDocAllVersions,
    updateDraft,
    getDraftDoc,
};
