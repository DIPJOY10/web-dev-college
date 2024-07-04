const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const FileSchema = new Schema({
    deleted: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
    // file goes from uploading, to processing to success
    // or to failed
    processed: {
        type: Boolean,
        default: false,
    },

    used: {
        type: Boolean,
        default: false,
    },
    // File usage - Image, Video,
    type: {
        type: String,
    },
    // local path on user's desktop/ mobile

    localUri: {
        type: String,
    },

    // jpeg ,png etc
    fileType: {
        type: String,
    },

    storage: {
        type: String,
        enum: ["firebase", "s3", "other"],
        default: "firebase",
    },
    // original file path
    filename: {
        type: String,
    },

    // if thumb size created then path is

    thumbFilename: {
        type: String,
    },

    // if small size created then path is

    smallFilename: {
        type: String,
    },

    // if medium size created then path is

    mediumFilename: {
        type: String,
    },

    // downloadable original url
    url: {
        type: String,
    },

    thumbUrl: {
        type: String,
    },

    smallUrl: {
        type: String,
    },

    mediumUrl: {
        type: String,
    },

    description: {
        type: String,
    },

    parent: {
        type: Schema.Types.ObjectId,
        refPath: "parentModelName",
    },

    parentModelName: {
        type: String,
    },

    userModelType: {
        type: String,
    },

    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    isExternalLink: {
        type: Boolean,
        default: false,
    },
});

const File = model("File", FileSchema);

module.exports = File;
