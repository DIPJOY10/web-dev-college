const TaskMap = require('../models/task.map.model');
var async = require('async');

const create = async (req,res)=>{
    var taskMap = new TaskMap({})

    try {
        var taskMap = await taskMap.save()
        res.json(taskMap)
    } catch (error) {
        
    }
}

const getTaskMap = async (req,res)=>{
    var taskMapId = req.body.taskMapId;

    try {
        var taskMap = await TaskMap.findById(taskMapId)
        res.json(taskMap)
    } catch (error) {
        
    }
}

const update = (req, res) => {
    var taskMapObject = req.body;
    var taskMapId = taskMapObject._id;

    TaskMap.findByIdAndUpdate(taskMapId, taskMapObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
                res.json(resp);
            }

        })
}

module.exports = {
    create,
    getTaskMap,
    update
}