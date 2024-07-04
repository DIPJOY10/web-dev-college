const CommentAndDiscussion = require('../models/commentAndDiscussion');
const { Comment, Discussion } = CommentAndDiscussion;
const Team = require('../models/team.model');
var _ = require('lodash');
var async = require('async');
const teamProjectSocket = require('../services/team.project.socket')

const getTeamDiscussions = (req,res)=>{

    var teamId = req.body.team;

    Discussion.find({teams:{"$in":[teamId]}})
        .populate({ path:'user',select:'name displayName wallet model',populate:{
            path:'displayPicture',model:'File',select:'url thumbUrl'
        }})
        .populate('files')
        .sort({'createdAt':-1})
        .then(discussions=>{
            res.json(discussions)
        })
}

const create = (req,res)=>{

    var discussion = new Discussion(req.body);
    var userId = discussion.user;
    discussion.save()
        .then(discussion=>{

            var teamId = discussion.team;


            Team.findById(teamId)

            .then(team=>{
 

                team.numDiscussions = team.numDiscussions?(team.numDiscussions + 1):1;

                team.save()
                .then(team=>{
                    const discussionId = discussion._id;
                    Discussion.findById(discussionId)
                        
                        .populate([
 
                            { path:'user',select:'name displayName wallet model',populate:{
                                path:'displayPicture',model:'File',select:'url thumbUrl'
                            }}
                        ])
                        .then(discussion=>{

                            teamProjectSocket(req,userId,teamId,{
                                team:team,
                                eventName:'DiscussionCreated',
                                discussion:discussion
                            })

                            res.json({
                                status:'200',
                                result:{
                                    team:team,
                                    discussion:discussion
                                }
                            })

                        })


                })
            })

        })

}

const update = (req,res)=>{
    var discussionObject = req.body;
    var discussionId = discussionObject._id;

    Discussion.findByIdAndUpdate(discussionId,discussionObject, { new: true },
        function(err,  resp) {
            if(err){
                console.log(err)
            }else{
            
                res.json(resp);
            }

    })

}

const getDiscussionsByIds = (req, res)=>{
    const discussions = req.body.discussions;
    async.map(discussions, function(discussionId, callback) {
        Discussion.findById(discussionId)
            .populate([{ path:'assigned.modelId',select:'name displayName wallet model',populate:{
                path:'displayPicture',model:'File',select:'url thumbUrl'
            } },
            { path:'user',select:'name displayName wallet model',populate:{
                path:'displayPicture',model:'File',select:'url thumbUrl'
            }}])
            .then(discussion => {
                callback(null, discussion)
            })
            .catch(err => {
                callback(err)
            })

    }, function(err, results) {

        res.json({
            status: '200',
            result: results
        })
    }) 
}

const deleteDiscussion = ( req, res)=>{
    var discussionId = req.body.discussionId;
    Discussion.findById(discussionId)
        .then(discussion=>{
            var teamId = discussion.team;
            Team.findById(teamId)
                .then(team=>{
                    team.numDiscussions = team.numDiscussions - 1;
                    team.save()
                        .then(team=>{
                            Discussion.findByIdAndDelete(discussionId)
                                .then(result=>{
                                    res.json(team);
                                })
                        })
                })
        }) 
}


module.exports = {
    getTeamDiscussions,
    getDiscussionsByIds,
    create,
    update,
    deleteDiscussion,
}