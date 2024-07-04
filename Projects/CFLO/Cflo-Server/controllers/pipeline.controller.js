const Pipeline = require('../models/pipeline.model');
var async = require('async');

const create = (req, res) => {
    var pipeline = new Pipeline(req.body);
    pipeline.save()
        .then(pipeline => {
            res.json(pipeline);
        })
}

const getPlatformPipelines =  (req, res) => {
    Pipeline.find({
        platform: true
    }).then(pipelines=>{      
        res.json(pipelines)
    })
}

const update = (req, res) => {
    var pipelineObject = req.body;
    var pipelineId = pipelineObject._id;

    Pipeline.findByIdAndUpdate(pipelineId, pipelineObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
                console.log(resp)
                res.json(resp);
            }

        })
}

const deletePipeline = (req, res) => {
    var pipelineId = req.body.pipelineId;
    Pipeline.findByIdAndDelete(pipelineId)
    .then(result=>{
        res.json(result);
    })
}


const getUserPipelines = (req,res)=>{

    Pipeline.find({$or:
        [
          {'user':req.body.user},
          {'teams': {$in: req.body.teams}}
        ]
    }).then(pipelines=>{
       
        res.json(pipelines)
    })
}

const getPipelines = (req, res) => {
    const pipelines = req.body.pipelines;
    Pipeline.find({ _id: { "$in": pipelines }})
        .then(pipelines=>{
            res.json({
                status: '200',
                result: pipelines
            })
        })
}

module.exports = {
    create,
    update,
    deletePipeline,
    getPlatformPipelines,
    getUserPipelines,
    getPipelines
}