const File = require("../models/file.model");
const AWS = require("aws-sdk");
const keys = require("../keys/keys");

const { v4: uuidv4 } = require("uuid");
var async = require("async");

const S3 = new AWS.S3({
    accessKeyId: keys.s3Key,
    secretAccessKey: keys.s3Secret,
});

const upload = (req, res) => {
    console.log("upload called");

    var file = new File(req.body);

    const fileKey = `${req.body.user}/${file._id}/${uuidv4()}.${req.body.name.split(".").pop()}`;
    file.url = keys.s3BucketUrl + fileKey;

    S3.getSignedUrl(
        "putObject",
        {
            Bucket: keys.s3BucketName,
            ContentType: req.body.type,
            Key: fileKey,
        },
        (err, url) => {
            // console.log(url,' is the url')
            // res.json({
            //     url,fileKey
            // })

            file.save().then(file => {
                res.json({
                    file,
                    url,
                });
            });
        }
    );
};

const create = (req, res) => {
    var file = new File(req.body);
    file.save().then(file => {
        res.json(file);
    });
};

const update = (req, res) => {
    var fileObject = req.body;
    var fileId = fileObject._id;

    File.findByIdAndUpdate(fileId, fileObject, { new: true }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            res.json(resp);
        }
    });
};

const updateFiles = (req, res) => {
    const files = req.body.files;
    async.map(
        files,
        function (file, callback) {
            var fileId = file._id;

            File.findByIdAndUpdate(fileId, file, { new: true }, function (err, resp) {
                if (err) {
                    callback(err);
                } else {
                    callback(null, resp);
                }
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

const getFiles = async (req, res) => {
    const files = req.body.files;
    const allFilesData = await File.find({ _id: { $in: files } })
    if (allFilesData) {
        res.json({
            status: "200",
            result: allFilesData,
        });
    } else {
        res.json({
            status: "400",
            result: null,
        });
    }
};

const updateDeleteFiles = async (req, res) => {
    const files = req.body.files;
    await File.updateMany(
        {
            _id: { $in: files },
        },
        {
            $set: {
                deleted: true,
            },
        },
        { multi: true },
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

const s3Resize = async (req, res) => {
    // full url of the upload file

    try {
        const fileId = req.body.fileId;
        const key = req.body.key;

        const isProd = req.body.isProd;
        const putResults = req.body.putResults;
        const sizes = ["thumb", "small", "medium"];

        const prodBucketDict = {
            main: "https://contractflo-prod.s3-us-west-2.amazonaws.com/",
            thumb: "https://prodthumb.s3.us-west-2.amazonaws.com/",
            small: "https://prodsmall.s3.us-west-2.amazonaws.com/",
            medium: "https://prodmedium.s3.us-west-2.amazonaws.com/",
        };

        const devBucketDict = {
            main: "https://contractflo-dev.s3-us-west-2.amazonaws.com/",
            thumb: "https://devthumb.s3.us-west-2.amazonaws.com/",
            small: "https://devsmall.s3.us-west-2.amazonaws.com/",
            medium: "https://devmedium.s3.us-west-2.amazonaws.com/",
        };

        const bucketDict = isProd ? prodBucketDict : devBucketDict;
        const thumbUrl = bucketDict["thumb"] + key;
        const smallUrl = bucketDict["small"] + key;
        const mediumUrl = bucketDict["medium"] + key;

        var newFileObj = {
            _id: fileId,
            thumbUrl,
            smallUrl,
            mediumUrl,
        };

        const fileSaved = await File.findByIdAndUpdate(fileId, newFileObj, { new: true });
        res.status(200).json({
            data: fileSaved,
        });
    } catch (error) {
        res.status(400).json({
            data: "FileNotFound",
        });
    }
};

module.exports = {
    upload,
    create,
    update,
    getFiles,
    updateFiles,
    s3Resize,
    updateDeleteFiles
};
