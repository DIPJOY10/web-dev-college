const FormResponse = require('../models/form.response.model');
const Issue = require('../models/issue.model');
const _ = require("lodash");


const manageFormRes = async (req, res) => {
    try {
        const issueId = req.body.issueId;

        let issue = await Issue.findById(issueId)
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
        .populate({
            path:'formResponses'
        })
        const form = issue.template.form

        var allQuestionIds = []
        if(form&&form.questions) {
            allQuestionIds = form.questions.map(question => question._id)
            
        }
        var allResponded = []
        if(issue&&issue.formResponses) {
            let formRess = issue.formResponses
            allResponded = formRess.map(res => res.question)
        }

        var notResponded = _.difference(
            JSON.parse(JSON.stringify(allQuestionIds)),
            JSON.parse(JSON.stringify(allResponded)),       
        )
        console.log(allResponded,allQuestionIds,notResponded,' allResponded,allQuestionIds,notResponded ')
        var newArr = notResponded.map(questionId =>{            
            return {
                question:questionId,
                issue:issue._id,
                form:form._id,
            }
        })

        let newFormRes = []
        var updateObj = {}
        if(newArr.length>0){
            newFormRes = await FormResponse.insertMany(newArr)
            const newFormResIds = newFormRes.map(res => res._id)
            updateObj = {
                $addToSet: { formResponses: newFormResIds },
            };
        }



        issue = await Issue.findByIdAndUpdate(issueId, updateObj, { new: true })
            .populate("files")
            .populate("parent")
            .populate("checklist")
            .populate('formResponses')
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
            console.log(issue,' is the issue')
            res.status(200).json({
                data:issue
            })
    } catch (error) {
        
    }
}

const update = async (req, res) => {
    try {

        var formResObject = req.body;
        var formResId = formResObject._id;

        const formRes = await FormResponse.findByIdAndUpdate(formResId, formResObject, { new: true })

        res.status(200).json({
            data: formRes
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })

    }
}



module.exports = {
    manageFormRes,
    update
}