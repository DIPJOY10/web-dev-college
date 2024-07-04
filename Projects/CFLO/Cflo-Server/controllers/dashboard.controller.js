const Job = require('../models/job.model');
const Post = require('../models/post.model');
const Investment = require('../models/investment.model')
const Application = require('../models/application.model')
var _ = require('lodash');
var async = require('async');

const getAndSetInvestmentJobProfile = () => {
    var models = [Investment, Job]

    async.map(models, function (model, callback) {
        model.find({})
            .populate({
                path: 'owner', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            })
            .populate({
                path: 'subject', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .then(modelObjects => {
                async.map(modelObjects, function (modelObject, callback) {
                    try {
                        var modelObjectId = modelObject._id
                        var profile = modelObject.owner.profile;
                        var newObject = {
                            _id: modelObjectId,
                            profile
                        }
                        model.findByIdAndUpdate(modelObjectId, newObject, { new: true },
                            function (err, resp) {

                                if (err) {
                                    callback(err)
                                } else {
                                    callback(null, resp)
                                }

                            })
                    } catch (error) {
                        console.log(error, ' in the model Object ', modelObject)
                    }


                }, function (err, results) {

                })
            })
    }, function (err, results) {

    })
}

const getData = (req, res) => {

    var models = [Investment, Job, Application, Post]

    const adminProfileIds = req.body.adminProfileIds || []

    if (adminProfileIds.length > 0) {
        async.map(models, function (model, callback) {
            model.find({
                $or:
                    [
                        { 'user': req.body.user },
                        { 'profile': { $in: adminProfileIds } },
                        { 'participants': { $in: adminProfileIds } }
                    ]
            })
                .populate({
                    path: 'profile', select: 'parent parentModelName', populate: {
                        path: 'parent', select: 'name displayName wallet', populate: {
                            path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path: 'owner', select: 'parent parentModelName', populate: {
                        path: 'parent', select: 'name displayName wallet', populate: {
                            path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path: 'subject', select: 'parent parentModelName', populate: {
                        path: 'parent', select: 'name displayName wallet', populate: {
                            path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path: 'user', select: 'name displayName wallet model', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                })
                .populate('files')
                .populate('categories')
                .populate({
                    path: 'roles',
                    populate: {
                        path: 'profile', select: 'parent parentModelName', populate: {
                            path: 'parent', select: 'name displayName wallet', populate: {
                                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                            }
                        }
                    }
                })
                .populate({
                    path: 'schedule', populate: {
                        path: "milestones"
                    }
                })
                .then(results => {
                    callback(null, results)
                })
        }, function (err, results) {

            res.status(200).json({
                data: {
                    investments: results[0],
                    jobs: results[1],
                    applications: results[2],
                    posts: results[3]
                }

            })
        })
    } else {

        res.status(200).json({
            data: {
                investments: [],
                jobs: [],
                applications: [],
                posts: []
            }

        })

    }



}

const getProfileData = (req, res) => {

    var models = [Investment, Job, Application, Post]
    const profileIds = req.body.profileIds;
    const user = req.body.user;

    async.map(models, function (model, callback) {
        model.find({
            $or:
                [
                    { 'user': user },
                    { 'owner': { $in: profileIds } }
                ]
        })
            .populate({
                path: 'owner', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'displayName displayPicture profile wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            })
            // .populate({
            //     path: 'subject', select: 'parent parentModelName', populate: {
            //         path: 'parent', select: 'displayName displayPicture profile wallet', populate: {
            //             path: 'displayPicture', model: 'File', select: 'url thumbUrl'
            //         }
            //     }
            // })
            .populate('files')
            .then(results => {
                callback(null, results)
            })
    }, function (err, results) {

        res.json({
            investments: results[0],
            jobs: results[1],
            applications: results[2],
            posts: results[3]
        })
    })

}


module.exports = {
    getAndSetInvestmentJobProfile,
    getData,
    getProfileData
}