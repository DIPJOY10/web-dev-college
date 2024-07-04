const Question = require("../models/question.model");
const Form = require("../models/form.model");
const FormOption = require("../models/form.option.model")
const ObjectId = require('mongoose').Types.ObjectId;

const createQuestionHelper = async (formId, newObj) => {
    try {
        var question = new Question(newObj);
    
        await question.save();
        const questionId = question._id;
        var updateObj = {
            $addToSet: { questions: questionId },
        };
    
        const form = await Form.findByIdAndUpdate(formId, updateObj, { new: true })
            .populate({
                path: 'questions', populate: {
                    path: 'options'
                }
            })
            .populate({
                path: 'questions', populate: {
                    path: 'optionCols'
                }
            }) 

        return {
            data: form,
            questionId,
        }

    } catch (error) {

        return {
            data: null,
            error: error,
        }
    }

 
}


const create = async (req, res) => {
    try {
        var formId = req.body.form;
        const newObj = req.body
        const result = await createQuestionHelper(formId,newObj)
        if(result.data){
            res.status(200).json(result);
        }else{
            res.status(400).json(result);

        }

    } catch (error) {

        res.status(400).json({
            data: null,
            error: error,
        });
    }
};


const createDefaultQuestion = async (req, res) => {
    var formId = req.body.form;
    console.log("create default question", formId, req.body);
    if (ObjectId.isValid(formId)) {
        const form = await Form.findById(formId)
            .populate({
                path: 'questions', populate: {
                    path: 'options'
                }
            })
            .populate({
                path: 'questions', populate: {
                    path: 'optionCols'
                }
            })
        if (form.questions.length > 0) {
            res.status(200).json({
                data: form,
            });
        } else {
            create(req, res)
        }
    }
}

const update = async (req, res) => {
    try {
        var questionObject = req.body;
        var questionId = questionObject._id;

        Question.findByIdAndUpdate(questionId, questionObject, { new: true })
            .populate('options')
            .populate('optionsCols')
            .then(data => {
                res.status(200).json({
                    data,
                });
            });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};
const deleteQuestion = async (req, res) => {
    try {
        var questionId = req.body.questionId;

        const question = await Question.findById(questionId);
        const questions = await Question.find({ question: questionId, template: { $exists: true } });

        if (questions?.length > 0) {
            res.status(200).json({
                data: {
                    delete: false,
                    message: "Attach to an issue",
                },
            });
        } else {
            await Question.findByIdAndDelete(questionId);

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
const getQuestions = async (req, res) => {
    try {
        var formId = req.body.form;
        Question.find({ form: formId })
            .populate('options')
            .populate('optionsCols')
            .then(data => {
                res.status(200).json({
                    data,
                });
            });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const createOption = async (req, res) => {
    try {
        let formOption = new FormOption(req.body);
        await formOption.save()
        console.log(formOption)

        const isCol = req.body.isCol
        const formOptionId = formOption._id
        var updateObj = {
            $addToSet: { options: formOptionId },
        };

        if (isCol) {
            updateObj = {
                $addToSet: { optionCols: formOptionId },
            };
        }


        let questionId = formOption.question;
        let question = await Question.findByIdAndUpdate(questionId, updateObj, { new: true })
            .populate('options')
            .populate('optionCols')

        res.status(200).json({
            data: question,
            optionId: formOptionId,
        });


    } catch (error) {

        res.status(400).json({
            data: null,
            error,
        });

    }
}

const deleteOption = async (req, res) => {
    try {
        const isCol = req.body.isCol
        const questionId = req.body.questionId
        const formOptionId = req.body.optionId

        var updateObj = {
            $pull: { options: formOptionId },
        };

        if (isCol) {
            updateObj = {
                $pull: { optionCols: formOptionId },
            };
        }
        console.log(questionId, formOptionId);
        let question = await Question.findByIdAndUpdate(questionId, updateObj, { new: true })
            .populate('options optionCols')

        res.status(200).json({
            data: question
        });
        console.log(question);

    } catch (error) {

        res.status(400).json({
            data: null,
            error,
        });

    }
}

const updateOption = async (req, res) => {
    try {
        const updateObj = req.body
        const optionId = updateObj._id
        let option = await FormOption.findByIdAndUpdate(optionId, updateObj, { new: true })
            .populate({
                path: 'question', populate: {
                    path: 'options'
                }
            })
            .populate({
                path: 'question', populate: {
                    path: 'optionCols'
                }
            })
        res.status(200).json({
            data: option.question
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
}



module.exports = {
    createQuestionHelper,
    create,
    createDefaultQuestion,
    update,
    deleteQuestion,
    getQuestions,
    createOption,
    deleteOption,
    updateOption
};
