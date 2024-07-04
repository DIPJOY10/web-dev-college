const Form = require('../models/form.model');
const Issue = require('../models/issue.model');
const Template = require('../models/issue.template.model');

const manageFormRes = async (req, res) => {
    try {
        const issueId = req.body.issueId;

        await Issue.findById(issueId)
        .populate({
            path: "template",        
            populate: {
                path: "pipeline"
            }
        })
        .populate({
            path: "template",        
            populate:{
                path: "form",
                populate: {
                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "options",
                        // model: "FormOption",
                    },
                },
            }
        })
        .populate({
            path: "template",        
            populate:{
                path: "form",
                populate: {
                    path: "questions",
                    model: "Question",
                    populate: {
                        path: "optionCols",
                        // model: "FormOption",
                    },
                },

            }
        })

    } catch (error) {
        
    }
}

const create = async (req, res) => {


    try {

        var form = new Form(req.body);

        await form.save().populate({
            path: "questions",
            model: "Question",
            populate: {
                path: "options",
                model: "FormOption",
            },
        })
            .populate({
                path: "questions",
                model: "Question",
                populate: {
                    path: "optionCols",
                    model: "FormOption",
                }
            })
        res.status(200).json({
            data: form
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })

    }

}

const update = async (req, res) => {

    try {

        var formObject = req.body;
        var formId = formObject._id;

        const form = await Form.findByIdAndUpdate(formId, formObject, { new: true })
            .populate({
                path: "questions",
                model: "Question",
                populate: {
                    path: "options",
                    model: "FormOption",
                },
            })
            .populate({
                path: "questions",
                model: "Question",
                populate: {
                    path: "optionCols",
                    model: "FormOption",
                }
            })

        res.status(200).json({
            data: form
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })

    }

}
const getFormHelper = async (req, res) => {
    const parent = req.body.parent;
    const parentModelName = req.body.parentModelName;
    const form = await Form.find({ parent, parentModelName })
        .populate({
            path: "questions",
            model: "Question",
            populate: {
                path: "options",
                model: "FormOption",
            },
        })
        .populate({
            path: "questions",
            model: "Question",
            populate: {
                path: "optionCols",
                model: "FormOption",
            }
        })
    if (form) {
        res.status(200).json({
            data: form
        })
    }
}
module.exports = {
    create,
    update,
    getFormHelper

}