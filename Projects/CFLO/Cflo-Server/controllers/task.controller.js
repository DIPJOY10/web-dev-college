const Task = require('../models/task.model');
const Issue = require('../models/issue.model')
const Team = require('../models/team.model');
const CommentAndDiscussion = require('../models/commentAndDiscussion');
var _ = require('lodash');
var async = require('async');
const teamProjectSocket = require('../services/team.project.socket')
const {
    create: createActivity
} = require('./activity.controller')
const { v4: uuidv4 } = require('uuid');
const { Comment } = CommentAndDiscussion;


const create = async (req, res) => {


    try {
        const index = req.body.index
        const issueId = req.body.issue

        var task = new Task(req.body);

        await task.save()  

        const taskId = task._id

        if(issueId){
            let issue = await Issue.updateOne(
                { _id: issueId },
                { $push: 
                    { 
                        checklist : {
                            $each: [ taskId  ],
                            $position: index
                        } 
                    }
                }
            )

            res.status(200).json({
                data : {
                    issue, task
                }
            })
        }else{
            res.status(200).json({
                data : {
                    task
                }
            })
        }





    } catch (error) {
       
        res.status(400).json({
            data : null,
            error
        })

    }

}

const update = async (req, res) => {
    
    try {
    
        var taskObject = req.body;
        var taskId = taskObject._id;
    
        const task = await Task.findByIdAndUpdate(taskId, taskObject, { new: true })

        res.status(200).json({
            data : task
        })

    } catch (error) {
       
        res.status(400).json({
            data : null,
            error
        })

    }

}


const deleteTask = async (req, res) => {

    try {

        var taskId = req.body.taskId;
        const task = await Task.findById(taskId)
        const issueId = task.issue
        await Comment.deleteMany({ 
            parent: task._id,
            parentModelName: "Task",
        })
        await Task.findByIdAndDelete(taskId)

        issue = await Issue.updateOne(
            { _id: issueId },
            { $pull: { checklist: issueId } }
        )

        res.status(200).json({
            data:null
        })

    } catch (error) {
        res.status(400).json({
            data:null,
            error:error
        })
    }

}




module.exports = {
    create,
    update,
    deleteTask
}