const Application = require('../models/application.model');
const Job = require('../models/job.model');
const Profile = require('../models/profile.model')
const Investment = require('../models/investment.model');
const CommentAndDiscussion = require('../models/commentAndDiscussion');
const { Comment } = CommentAndDiscussion;
var async = require('async');

const create = async (req, res) => {
    var app = new Application(req.body);

    var comment = new Comment({
        text: app.message,
        files: app.files,
        user: app.user,
        parent: app._id,
        parentModelName: 'Application',
        profile: app.profile
    })

    app.topComment = comment._id;

    async.parallel([
        function (callback) {
            app.save()
                .then(app => {
                    callback(null, app)
                })
        },
        function (callback) {
            switch (app.parentModelName) {
                case 'Job':
                    Job.findById(app.parent)
                        .then(job => {
                            job.numApps = job.numApps ? job.numApps + 1 : 1;
                            job.save()
                                .then(job => {
                                    callback(null, job)
                                })
                        })
                    break;

                case 'Investment':
                    Investment.findById(app.parent)
                        .then(investment => {
                            investment.numApps = investment.numApps ? investment.numApps + 1 : 1;
                            investment.save()
                                .then(investment => {
                                    callback(null, investment)
                                })
                        })
                    break;

                default:
                    break;
            }
        },
        function (callback) {
            comment.save()
                .then(comment => {
                    Comment.findById(comment._id)
                        .populate({
                            path: 'user', select: 'name displayName wallet model', populate: {
                                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                            }
                        })
                        .populate({
                            path: 'profile', populate: {
                                path: 'parent', populate: {
                                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                                }
                            }
                        })
                        .then(comment => {
                            callback(null, comment)
                        })

                })
        }
    ], function (err, results) {
        var app = results[0];
        res.json(app)
    })
}

const update = (req, res) => {
    var applicationObject = req.body;
    var applicationId = applicationObject._id;

    Application.findByIdAndUpdate(applicationId, applicationObject, { new: true },
        function (err, resp) {
            if (err) {
                console.log(err)
            } else {
                Application.findById(applicationId)
                    .populate({
                        path: 'profile', populate: {
                            path: 'parent', populate: {
                                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                            }
                        }
                    })
                    .populate('topComment')
                    .then(app => {

                        res.json(app)
                    })
            }

        })
}

const getApps = (req, res) => {

    Application.find({
        parent: req.body.parent,
        parentModelName: req.body.model
    })
        .populate({
            path: 'profile', populate: {
                path: 'parent', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'topComment', populate: {
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .then(apps => {

            res.json({
                apps
            })
        })
}

const isAppsExist = (req, res) => {
    Application.find({
        profile: req.body.parent,
        parentModelName: req.body.model,
        parent: req.body.parent
    })
        .populate({
            path: 'profile', populate: {
                path: 'parent', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'topComment', populate: {
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })

        // let success=false;
        .then(apps => {
            // res.json({ apps })
            // console.log(apps)
            res.send(apps.length > 0 ? true : false);
        })
}


const getProfileApps = (req, res) => {

    var profileIds = req.body.profileIds;

    Application.find({
        profile: { $in: profileIds }
    })
        .populate({
            path: 'profile', populate: {
                path: 'parent', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'topComment', populate: {
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .then(apps => {

            res.json({
                apps
            })
        })
}
const getApplicationDetail = async (req, res) => {
    var appId = req.body.appId;
    Application.findById(appId)
        .populate({
            path: 'profile', populate: {
                path: 'parent', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'topComment', populate: {
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate('parent')
        .populate('files')
        .populate('user')
        .then(apps => {
            res.json({
                apps
            })
        })
}
const getAppliedDetails = async (req, res) => {
    // var appId = req.body.appId;

    Application.find({ profile: req.body.profile, parent: req.body.modelId })
        .populate({
            path: 'profile', populate: {
                path: 'parent', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'topComment', populate: {
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate('parent')
        .populate('files')
        .populate('user')
        .then(apps => {
            res.json({
                apps
            })
        })
}
const getApplications = async (req, res) => {
    var userId = req.body.userId;
    var parentModelName = req.body.parentModelName;
    Application.find({ profile: userId, parentModelName: parentModelName }).populate('parent').then((apps) => {
        res.json(apps);
        // console.log(jobs, 'AppledJobs')
    })
}
module.exports = {
    create,
    update,
    getApps,
    isAppsExist,
    getProfileApps,
    getApplicationDetail,
    getAppliedDetails,
    getApplications
}
