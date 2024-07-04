const Job = require('../models/job.model');
const Project = require('../models/project.model');
const Category = require('../models/category.model');
const JobTypes = require('../helpers/job.types')
const PropertyTypes = require('../helpers/property.type')
const _ = require('lodash')
const async = require('async');
const StatusItem = require('../models/issue.status.item.model');
const IssueTemplate = require('../models/issue.template.model');
const Save = require('../models/save.model');

const getJobDetail = async (req, res) => {

    var jobId = req.body.jobId

    try {

        const job = await Job.findById(jobId)
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
            .populate('files')
            .populate('categories')

        console.log(job, 'is the job')

        res.status(200).json({
            data: job
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })
    }

}

const createJobCategories = async () => {

    const oldSkills = await Category.find({})

    if (oldSkills.length > 0) {
        console.log(oldSkills.length, ' categories exist')
    } else {

        var primaryJobs = JobTypes.primaryJobs;

        var newCatArr = [];

        primaryJobs.map(function (primaryJob) {
            var primaryJob1 = new Category({
                name: primaryJob,
            })
            var primaryJobId = primaryJob1._id;

            var subJobs = JobTypes[primaryJob].subJobs

            var subjobs = subJobs.map(subJob => {
                var subJob1 = new Category({
                    name: subJob,
                    parent: primaryJobId,
                    ancestors: [primaryJobId]
                })

                return subJob1
            })


            newCatArr = [...newCatArr, primaryJob1, ...subjobs];

        })

        try {
            const items = await Category.insertMany(newCatArr)
        } catch (error) {
            console.error(error, ' is the error')
        }

    }

}


const createPropCategories = async () => {
    var Property = new Category({
        name: 'Property'
    });

    var propId = Property._id;

    var primaryProps = PropertyTypes.primary;

    await Property.save()

    async.map(primaryProps, function (primaryProp, callback) {
        var primaryProp1 = new Category({
            name: primaryProp,
            parent: propId,
            ancestors: [propId]
        })
        var primaryPropId = primaryProp1._id;

        var subProps = PropertyTypes[primaryProp].type

        var subprops = subProps.map(subProp => {
            var subProp1 = new Category({
                name: subProp,
                parent: primaryPropId,
                ancestors: [propId, primaryPropId]
            })

            return subProp1
        })

        var primaryBlock = [primaryProp1, ...subprops];
        async.map(primaryBlock, async function (prop) {
            await prop.save()
        })
    })

}

const getJobTypes = (req, res) => {

    Category.find({ name: 'Jobs' }).then(categories => {
        var cat0Id = categories[0]._id;

        // find primary job categories

        Category.find({ parent: cat0Id }).then(cat1s => {

            async.map(cat1s, function (cat1, callback) {
                var cat1Id = cat1._id;
                Category.find({ parent: cat1Id }).then(cat2s => {
                    callback(null, {
                        main: cat1,
                        subs: cat2s
                    })
                })
            }, function (err, results) {
                res.json(results)
            })
            // find secondary job categories and res

        })

    })

}

const getPropTypes = (req, res) => {

    Category.find({ name: 'Property' }).then(categories => {
        var cat0Id = categories[0]._id;

        // find primary job categories

        Category.find({ parent: cat0Id }).then(cat1s => {

            async.map(cat1s, function (cat1, callback) {
                var cat1Id = cat1._id;
                Category.find({ parent: cat1Id }).then(cat2s => {
                    callback(null, {
                        main: cat1,
                        subs: cat2s
                    })
                })
            }, function (err, results) {

                res.json(results)
            })
            // find secondary job categories and res

        })

    })

}


const create = async (req, res) => {

    try {

        var job = new Job(req.body)
        job = await job.save()
        const jobId = job._id;
        job = await Job.findById(jobId)
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
            .populate('categories')
            .populate('files')
            .populate({
                path: 'subject', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            })

        res.status(200).json({
            data: job
        })

    } catch (error) {
        res.send(error)
    }
}

const update = async (req, res) => {
    var jobObject = req.body;
    var jobId = jobObject._id;
    return Job.findByIdAndUpdate(jobId, jobObject, { new: true },
        function (err, resp) {
            if (err) {
                console.log(err)
            } else {

                Job.findById(jobId)
                    .populate({
                        path: 'profile', select: 'parent parentModelName', populate: {
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
                        path: 'owner', select: 'name displayName wallet model', populate: {
                            path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                        }
                    })
                    .populate('files')
                    .populate('categories')
                    .populate({
                        path: 'subject', select: 'parent parentModelName', populate: {
                            path: 'parent', select: 'name displayName wallet', populate: {
                                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                            }
                        }
                    })

                    .then(job => {
                        res.status(200).json({
                            data: job
                        })
                    })
            }

        })
}

const updateJobAndProjectCommon = async (req, res) => {
    var jobObject = req.body;
    var jobId = jobObject._id;

    delete jobObject._id
    var job = await Job.findById(jobId)
    job.propertyTypes = jobObject.propertyTypes;
    job.area = jobObject.area;

    var projectId = job.project;
    var project = await Project.findById(projectId)
    project.propertyTypes = jobObject.propertyTypes;
    project.area = jobObject.area;

    job = await job.save()
    project = await project.save()
    res.json({
        job, project
    })
}

const getJob = async (req, res) => {
    Job.findById(req.body.jobId)
        .then(job => {
            res.json(job)
        })
}

const getUserJobs = async (req, res) => {
    Job.find({
        $or:
            [
                { 'user': req.body.user },
                { 'participants': { $in: [req.body.user] } }
            ]
    }).then(jobs => {
        res.json(jobs)
    })
}
const createDefaultJobPipeline = async () => {
    //States: Recieved, Under Review, Shortlisted, Accepted, Rejected
    //Choose color: 
    //InsertMany statusItems
    let findJobDefaultTemplate = await IssueTemplate.find({ platform: true, title: "Job Default" });
    if (findJobDefaultTemplate.length > 0) {
        return null;
    }
    else {
        let findTemplate = await IssueTemplate.find({ platform: true });
        console.log(findTemplate, "FindTemplate");
        const defaultPipeline = [
            {
                text: "Received",
                color: "#00FF80",
            },
            {
                text: "Under Review",
                color: "#FF8000",
            },
            {
                text: "Shortlisted",
                color: "#FF8000",
            },
            {
                text: "Accepted",
                color: "#00FFFF",
            },
            {
                text: "Rejected",
                color: "#FF00FF",
            },


        ];

        const statusItems = await StatusItem.insertMany(defaultPipeline);
        const template = {
            pipeline: statusItems.map((statusItemsId) => { return statusItemsId?._id }),
            type: 'Job',
            title: "Job Default",
            platform: true,
            startState: statusItems[0]?._id
        }
        let createTemplate = new IssueTemplate(template);
        await createTemplate.save();
        console.log(createTemplate);
        if (findTemplate.length === 0) {
            await IssueTemplate.insertMany(createTemplate);
        }
        return createTemplate;
    }
}
const getSavedJobs = async (req, res) => {
    const profileId = req.body.profile;
    const userId = req.body.user;
    Save.find({ profile: profileId, user: userId, parentModelName: "Job" }).then((jobs) => {

        res.json(jobs);
        // console.log(jobs, "savedJobs")
    })
}
module.exports = {
    createJobCategories,
    createPropCategories,
    getJobTypes,
    getPropTypes,
    create,
    update,
    updateJobAndProjectCommon,
    getJob,
    getUserJobs,
    getJobDetail,
    createDefaultJobPipeline,
    getSavedJobs
}