const File = require("../models/file.model");
const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const async = require("async");
const redis = require("redis");
const {firebaseAdmin} = require("../services/firebase");
const {create: createWallet} = require("./accounting/wallet.controller");
const {redisClient, connectionStatus} = require("../services/redis");
const signIn = async (req, res) => {
    let {email, firebaseUid, imagePath, displayName, token} = req.body;
    imagePath = imagePath || "https://i.ibb.co/WWcnXny/4737448-account-user-avatar-profile-icon.png";
    try {
        // const test = await firebaseAdmin.auth();
        let decodedToken;
        if (connectionStatus) {
            decodedToken = await redisClient?.get(firebaseUid);
        }
        if (!decodedToken) {
            console.log("no cache-================");
            decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
            redisClient.set(firebaseUid, JSON.stringify(decodedToken), {EX: 10000});
        } else {
            console.log(" cache-================");
            decodedToken = JSON.parse(decodedToken);
        }

        const firebaseUser = decodedToken.uid;
        console.log("firebase user 1", firebaseUser);
        if (firebaseUser) {
            var query = User.find({firebaseUid: firebaseUid}).populate("displayPicture").populate("cover");

            const users = await query.exec();

            // skip if user already with connected account

            if (users.length > 0) {
                return res.json(users[0]);
            }

            const file = new File({
                uploadStatus: "success",
                fileUsage: "Image",
                storage: "s3",
                url: imagePath,
                thumbUrl: imagePath,
            });

            var user = new User({
                email,
                displayName,
                firebaseUid,
                displayPicture: file._id,
            });

            const address = req?.body?.address || {};

            const wallet = await createWallet(user._id, "User", email, displayName, address);

            const walletId = wallet._id;
            user.wallet = walletId;

            var profile = new Profile({
                parent: user._id,
                parentModelName: "User",
            });

            await profile.save();

            user.profile = profile._id;

            await file.save();

            user = await user.save();
            console.log("user", user);
            user.displayPicture = file;
            res.json(user);
        } else {
            return res.json({status: 400, error: "Firebase user not found"});
        }
    } catch (error) {
        console.log(error);
        return res.json({status: 400, error: "Firebase user not found"});
    }
};

const getUserByToken = async (req, res) => {
    const firebaseIdToken = req.body.tokenUrl;

    firebaseAdmin
        .auth()
        .verifyIdToken(firebaseIdToken)
        .then(function (decodedToken) {
            let uid = decodedToken.uid;
            console.log(uid, " is the uid");
            User.find({firebaseUid: uid})
                .populate("displayPicture")
                .then(users => {
                    req.body.user = users[0];
                    res.json(user);
                })
                .catch(err => {
                    req.body.user = null;
                    return res.status(400).send({
                        message: "User not found.",
                    });
                });
            // ...
        })
        .catch(function (error) {
            req.body.user = null;
            return res.status(400).send({
                message: "Problem with Authentication token",
            });
        });
};

function isImage(url) {
    return /\.(jpg|jpeg|png|webp|avif|jfif|gif|svg)$/.test(url.toLowerCase());
}

const dpChange = async (req, res) => {
    let userId = req.body.userId;
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
                    const user = await User.findByIdAndUpdate(userId, {cover: fileId}, {new: true});
                    console.log(user);
                    user.cover = file;
                } else {
                    const user = await User.findByIdAndUpdate(userId, {displayPicture: fileId}, {new: true});
                    console.log(user);
                    user.displayPicture = file;
                }
                res.status(200).json({data: file});
            } else {
                console.log("Its not an image");
            }
        }
    });
};

const updateInfo = async (req, res) => {
    let userId = req.body.userId;
    let userData = req.body.userInfo;
    console.log(userData);
    User.findOneAndUpdate({_id: userId}, {...userData}, {new: true}, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User Data Updated!");
            res.json({
                status: 200,
                data: docs,
            });
        }
    });
};

const updateInfoArray = async (req, res) => {
    let userId = req.body.userId;
    let userData = req.body.userInfo;
    let arrayName = req.body.arrayName;
    console.log(userData);
    User.findOneAndUpdate({_id: userId}, {$addToSet: {[arrayName]: userData}}, {new: true}, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("User Data Updated!");
            console.log(docs);
            res.json({
                status: 200,
                data: docs,
            });
        }
    });
};

const editUserArray = async (req, res) => {
    let arrayId = req.body.arrayId;
    let arrayObj = req.body.arrayObj;
    let arrayName = req.body.arrayName;
    console.log(arrayObj);
    console.log(arrayName);
    console.log(arrayId);
    let searchProperty = arrayName + "._id";
    let setProperty = arrayName + ".$";
    User.findOneAndUpdate(
        {
            [searchProperty]: arrayId,
        },
        {
            $set: {
                [setProperty]: arrayObj,
            },
        },
        {new: true},
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

const fetchUserInfo = async (req, res) => {
    try {
        let userId = req.body.userId;
        let doc = await User.findById(userId);
        res.json({
            status: 200,
            data: doc,
        });
    } catch (error) {
        console.log(error);
    }
};

const deleteArrayItem = async (req, res) => {
    let userId = req.body.userId;
    let arrayObjId = req.body.arrayObjId;
    let arrayName = req.body.arrayName;
    try {
        User.findOneAndUpdate({_id: userId}, {$pull: {[arrayName]: {_id: arrayObjId}}}, {new: true}, (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                console.log(arrayName + " Object Deleted!");
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        });
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
        {new: true},
        (err, docs) => {
            if (err) {
                res.json({
                    status: 400,
                    data: null,
                    err,
                });
            } else {
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        }
    );
};

const updateFileOnDeletionMany = async (req, res) => {
    let fileIds = req.body.fileIds;
    console.log(fileIds);
    await File.updateMany(
        {
            _id: {$in: fileIds},
        },
        {
            $set: {
                deleted: true,
            },
        },
        {multi: true},
        (err, docs) => {
            if (err) {
                res.json({
                    status: 400,
                    data: null,
                    err,
                });
            } else {
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        }
    );
};

const deleteProjPic = (req, res) => {
    let userId = req.body.userId;
    let projectId = req.body.projectId;
    let fileId = req.body.fileId;
    console.log("UserId: " + userId + "ProjectId: " + projectId + "FileId: " + fileId);
    try {
        User.findOneAndUpdate(
            {_id: userId, "projects._id": projectId},
            {$pull: {"projects.$.pictures": fileId}},
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
                        {new: true},
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

//unused
const saveProjectInfo = (req, res) => {
    let userId = req.body.userId;
    let projectObj = req.body.projectObj;
    User.findOneAndUpdate({_id: userId}, {$addToSet: {projects: projectObj}}, {new: true}, (err, docs) => {
        if (err) {
            console.log(err);
        } else {
            console.log("New Project Added!");
            console.log(docs);
            res.json({
                status: 200,
                data: docs,
            });
        }
    }).populate("projects.pictures");
};

module.exports = {
    signIn,
    getUserByToken,
    dpChange,
    updateInfo,
    updateInfoArray,
    fetchUserInfo,
    editUserArray,
    deleteArrayItem,
    deleteProjPic,
    updateFileOnDeletion,
    saveProjectInfo,
    updateFileOnDeletionMany,
};
