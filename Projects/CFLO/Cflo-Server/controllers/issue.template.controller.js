const IssueTemplate = require("../models/issue.template.model");
const StatusItem = require("../models/issue.status.item.model");
const Issue = require("../models/issue.model");
const ObjectId = require("mongoose").Types.ObjectId;
const Profile = require("../models/profile.model");
const Job = require("../models/job.model");
const Form = require("../models/form.model");
const { createQuestionHelper } = require("./form.question.controller");

const importTemplate = async (req, res) => {
   
    try {

        const templateIds = req.body.templateIds;
        const profileId = req.body.profileId;
        var updateObj = {
            $addToSet: { shared: profileId },
        };
    
        await IssueTemplate.updateMany({_id:{$in:templateIds}},updateObj)
        const templates = await IssueTemplate.find({_id:{$in:templateIds}})

        res.status(200).json({
            data: templates,
        });

    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
}

const cloneTemplate = async (req,res)=>{
    try{
        const templateIdArray = req.body.templateIdArray;
        const profileId = req.body.profileId;
        const templates = await IssueTemplate.find({_id:{$in:templateIdArray}});
        
    }catch(err){
        res.status(400).json({
            data:null,
            error:err
        });
    }
}

const getProfileData = async (req, res) => {
    const profileId = req.body.profileId;

    try {
        if (ObjectId.isValid(profileId)) {
            let queries = [{ profile: profileId }];
            const profile = await Profile.findById(profileId).populate({
                path: "parent",
                select: "parentModelName parent",
            });

            queries.push({ shared: { $in: [profileId] } });

            const templates = await IssueTemplate.find({
                $or: queries,
            })
            .populate("pipeline")
            .populate({
                path: "form",
                populate: {
                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "options",
                        // model: "FormOption",
                    },
                    populate: {
                        path: "optionCols",
                        // model: "FormOption",
                    },

                    populate: {
                        path: "profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                },

            });;

            res.status(200).json({
                data: {
                    profile,
                    templates: templates,
                },
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

const defaultStates = async (req, res) => {
    try {
        const templateId = req.body.template;

        const stateArr = [
            {
                text: "Start",
                color: "#00FFFF",
            },
            {
                text: "Step1",
                color: "#FF00FF",
            },
            {
                text: "Success",
                color: "#00FF80",
            },
            {
                text: "Failure",
                color: "#FF8000",
            },
        ];

        const items = await StatusItem.insertMany(stateArr);

        let issueTemplate = await IssueTemplate.findByIdAndUpdate(
            templateId,
            {
                _id: templateId,
                pipeline: items.map(item => item._id),
            },
            { new: true }
        );

        res.status(200).json({
            data: {
                issueTemplate,
                items: items,
            },
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const createStatus = async (req, res) => {
    try {
        const index = req.body.index;

        var status = new StatusItem(req.body);

        await status.save();

        const statusId = status._id;
        const templateId = req.body.template;
        console.log(statusId,templateId,' is the status')
        let issueTemplate = await IssueTemplate.findByIdAndUpdate(
            templateId,{
                $push: {
                    pipeline: {
                        $each: [statusId],
                        $position: index,
                    },
                },
            }, { new: true }
        )            
        .populate("pipeline")
        .populate({
            path: "form",
            populate: {

                path: "questions",
                model: "Question",
                populate: {
                    path: "options",
                    model: "FormOption",
                },
                populate: {
                    path: "optionCols",
                    model: "FormOption",
                },

                populate: {
                    path: "profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            },

        })
        .populate({
            path: "assigned",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .populate({
            path: "shared",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })


        res.status(200).json({
            data: {
                issueTemplate,
                status,
            },
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const updateStatus = async (req, res) => {
    try {
        var statusObject = req.body;
        var statusId = statusObject._id;

        const status = await StatusItem.findByIdAndUpdate(statusId, statusObject, { new: true });

        res.status(200).json({
            data: status,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const deleteStatus = async (req, res) => {
    try {
        var statusId = req.body.statusId;
        const status = await StatusItem.findById(statusId);
        const issueTemplateId = status.issueTemplate;

        await StatusItem.findByIdAndDelete(statusId);

        let issueTemplate = await IssueTemplate.updateOne({ _id: issueTemplateId }, { $pull: { pipeline: issueTemplateId } });

        res.status(200).json({
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const create = async (req, res) => {
    try {
        let template = new IssueTemplate(req.body);
        const templateId = template._id;


        const stateArr = [
            {
                text: "Start",
                color: "#00FFFF",
                template:templateId
            },
            {
                text: "Step1",
                color: "#FF00FF",
                template:templateId
            },
            {
                text: "Success",
                color: "#00FF80",
                template:templateId
            },
            {
                text: "Failure",
                color: "#FF8000",
                template:templateId
            },
        ];


        let form = new Form({ createdBy: req.body.profile, parent: templateId, parentModelName: "IssueTemplate" });
        let formId = form._id
        template.form = formId;
        const items = await StatusItem.insertMany(stateArr);
        template.pipeline = items.map(item=>item._id)
        template.finalStates = [items[2]._id,items[3]._id]
        template.startState = items[0]._id
        await template.save();
        await form.save();

        let result = await createQuestionHelper(formId, {
            form:formId,
            type: "Linear Scale",
			questionText: "Select Priority",
			profile: req.body.profile
        })
        template = await IssueTemplate.findById(templateId)
            .populate("pipeline")
            .populate({
                path: "form",
                populate: {
                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "options",
                        // model: "FormOption",
                    },
                    populate: {
                        path: "optionCols",
                        // model: "FormOption",
                    },

                    populate: {
                        path: "profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                },

            });

        res.status(200).json({
            data: template,
        });
    } catch (error) {
        res.status(400).json({ error, data: null });
    }
};

const createForm = async (req, res) => {
    try {
        const templateId = req.body.templateId;
        let template = await IssueTemplate.findById(templateId)
            .populate("pipeline")
            .populate({
                path: "form",
                populate: {

                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "options",
                        // model: "FormOption",
                    },
                    populate: {
                        path: "optionCols",
                        // model: "FormOption",
                    },

                    populate: {
                        path: "profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                },

            });

        if (template.form) {

        } else {
            let form = new Form({ createdBy: req.body.profile, parent: template._id, parentModelName: "IssueTemplate" });
            await form.save();

            template = await IssueTemplate.findByIdAndUpdate(templateId, { form: form._id }, { new: true })
                .populate("pipeline")
                .populate({
                    path: "form",
                    populate: {

                        path: "questions",
                        model: "Question",
                        populate: {
                            path: "options",
                            model: "FormOption",
                        },
                        populate: {
                            path: "optionCols",
                            model: "FormOption",
                        },

                        populate: {
                            path: "profile",
                            select: "parent parentModelName",
                            populate: {
                                path: "parent",
                                select: "name displayName model",
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        },
                    },

                });
        }



        res.status(200).json({
            data: template
        });
    } catch (error) {
        res.status(400).json({ error, data: null });
    }
};

const update = async (req, res) => {
    try {
        const templateNew = req.body;
        console.log(req.body.startState,' istemplate update')
        let template = await IssueTemplate.findByIdAndUpdate(templateNew._id, templateNew, { new: true })
        .populate("pipeline")
        .populate({
            path: "form",
            populate: {

                path: "questions",
                model: "Question",
                populate: {
                    path: "options",
                    model: "FormOption",
                },
                populate: {
                    path: "optionCols",
                    model: "FormOption",
                },

                populate: {
                    path: "profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            },

        })
        .populate({
            path: "assigned",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .populate({
            path: "shared",
            model: "Profile",
            select: "parent parentModelName",
            populate: {
                path: "parent",
                select: "name displayName",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        });
        res.status(200).json({
            data: template,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getTemplateDetail = async (req, res) => {
    try {
        const templateId = req.body.template;

        const template = await IssueTemplate.findById(templateId)
            .populate("pipeline")
            .populate({
                path: "form",
                populate: {
                    path: "questions",
                    populate: {
                        path: "optionCols",
                        model: "FormOption",
                    }
                },

            })
            .populate({
                path: "form",
                populate: {
                    path: "questions",
                    populate: {
                        path: "options",
                        model: "FormOption",
                    }
                },

            })
            .populate({
                path: "assigned",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shared",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })

        res.status(200).json({
            data: { template: template, },
        });

    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const deleteTemplate = async (req, res) => {
    try {
        var templateId = req.body.templateId;
        console.log('onDelete called')
        const issues = await Issue.find({ template: templateId, template: { $exists: true }, template: templateId });

        if (issues?.length > 0) {
            res.status(200).json({
                data: {
                    delete: false,
                    message: "Attach to an issue",
                },
            });
        } else {
            await IssueTemplate.findByIdAndDelete(templateId);

            res.status(200).json({
                data: {
                    delete: true,
                },
            });
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const getTemplates = async (req, res) => {
    const profileId = req.body.profileId;

    try {
        if (ObjectId.isValid(profileId)) {
            let queries = [{ profile: profileId }];
            queries.push({ shared: { $in: [profileId] } });

            const templates = await IssueTemplate.find({
                $or: queries,
            })
            .populate("pipeline")
            .populate({
                path: "form",
                populate: {
                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "options",
                        // model: "FormOption",
                    },
                    populate: {
                        path: "optionCols",
                        // model: "FormOption",
                    },

                    populate: {
                        path: "profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                },

            });;

            res.status(200).json({
                data: templates,
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
const getTypeTemplates = async (req, res) => {
    const profileId = req.body.profileId;
    const type = req.body.type;
    try {
        if (ObjectId.isValid(profileId)) {
            let queries = [{ profile: profileId, type }];
            queries.push({ shared: { $in: [profileId] }, type });
            queries.push({ title: `${type} Default` });

            const templates = await IssueTemplate.find({
                $or: queries,
            })            
            .populate("pipeline")
            .populate({
                path: "form",
                populate: {
                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "options",
                        // model: "FormOption",
                    },
                    populate: {
                        path: "optionCols",
                        // model: "FormOption",
                    },

                    populate: {
                        path: "profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName model",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                },

            });;

            res.status(200).json({
                data: templates,
            });
            console.log(type, "Type Templates");
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

const getDataFromList = async (req, res) => {
    // const listId = "6343de20e1ee7d331089b14c";
    const listId = req.body.listId;
    try {
        const dataIssue = await Issue.find({ template: listId })
            .populate("files")
            .populate("parent")
            .populate("checklist template")
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
                path: "user",
                select: "name displayName",
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
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "template",
                model: "IssueTemplate",
                populate: "pipeline",
                // populate: {
                //     path: "parent",
                //     select: "name displayName",
                //     populate: {
                //         path: "displayPicture",
                //         model: "File",
                //         select: "url thumbUrl",
                //     },
                // },
            })
            .populate({
                path: "assigned",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shared",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shared",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "transactions",
                populate: {
                    path: "billList",
                    model: "BillList",
                    populate: {
                        path: "items",
                        populate: {
                            path: "offering",
                        },
                    },
                },
            })
            .populate({
                path: "calendarEvents",
                populate: {
                    path: "people",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            });

        const dataJob = await Job.find({ template: listId })
            .populate("files")
            .populate("parent")
            .populate("checklist template")
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
                path: "user",
                select: "name displayName",
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
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "template",
                model: "IssueTemplate",
                populate: "pipeline",
                // populate: {
                //     path: "parent",
                //     select: "name displayName",
                //     populate: {
                //         path: "displayPicture",
                //         model: "File",
                //         select: "url thumbUrl",
                //     },
                // },
            })
            .populate({
                path: "assigned",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shared",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shared",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "transactions",
                populate: {
                    path: "billList",
                    model: "BillList",
                    populate: {
                        path: "items",
                        populate: {
                            path: "offering",
                        },
                    },
                },
            })
            .populate({
                path: "calendarEvents",
                populate: {
                    path: "people",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            });

        let data = [...dataIssue, ...dataJob];
        // data.push(dataIssue);
        // data.push(dataJob)
        // console.log(data, "Data of list");
        res.status(200).json(data);
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};
const changeIssueState = async (req, res) => {
    try {
        const { issueId, status, closed } = req.body;
        const result = await Issue.updateOne(
            { _id: issueId },
            {
                $set: {
                    status: status,
                    closed: closed,
                },
            }
        );
        res.status(200).json({
            success: true,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error,
        });
    }
};
// getDataFromList();
module.exports = {
    defaultStates,
    createStatus,
    updateStatus,
    deleteStatus,
    importTemplate,
    cloneTemplate,
    create,
    createForm,
    update,
    deleteTemplate,
    getTemplateDetail,
    getTemplates,
    getProfileData,
    getTypeTemplates,
    getDataFromList,
    changeIssueState,
};
