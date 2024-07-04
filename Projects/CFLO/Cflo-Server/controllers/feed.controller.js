const Investment = require('../models/investment.model')
const Job = require('../models/job.model');
const Post = require('../models/post.model');
var labels = require('./labels')
var _ = require('lodash');
var async = require('async');

const getFeed = async ( req, res)=>{
    var models = [Investment, Job, Post]
    async.map(models,function(model,callback) {
        model.find({published:true})
            .populate({
                path :'profile',select:'parent parentModelName', populate :{
                    path: 'parent',select:'name displayName wallet',populate:{
                        path:'displayPicture',model:'File',select:'url thumbUrl'
                    }
                }
            })
            .populate({ path:'owner',select:'name displayName wallet model',populate:{
                path:'displayPicture',model:'File',select:'url thumbUrl'
            }})
            .then(results=>{
                callback(null, results)
            })

        
    }, function(err, results) {
        
        res.json({
            investments:results[0],
            jobs:results[1],
            posts: results[2]
        })
    })
}

module.exports = {
    getFeed
}