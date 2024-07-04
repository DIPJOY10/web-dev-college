var _ = require('lodash');
const Project = require('../models/project.model')
const Organization = require('../models/organization.model')
const Chat = require('../models/chatAndMessages.model')

const { Conversation } = Chat;

const ModelDict = {
    models:[ Project,Organization,Conversation],
    Project,
    Organization,
    Conversation
}

const addParticipant = (req, res)=>{
    const { 
        parentType,
        parentId,
        participantType,
        participantId
    } = req.body;

    const Parent = ModelDict[parentType];
    Parent.findById(parentId)
        .then(parent=>{
            var participants = parent.participants;
            var participantIdSet = new Set(participants);
            participantIdSet.add(participantId);
            parent.participants = Array.from(participantIdSet);

            var allTimeMembers = parent.allTimeMembers;
            allTimeMembers.filter(member=>(member.modelId===participantId))
            
            if(allTimeMembers.length==0){
                parent.allTimeMembers = [...allTimeMembers,{
                    modelId:participantId,
                    modelType:participantType
                }]
            }

            parent.save()
                .then(parent=>{
                    Parent.findById(parentId)
                    .populate([{ path:'allTimeMembers.modelId',select:'name displayName wallet model',populate:{
                        path:'displayPicture',model:'File',select:'url thumbUrl'
                    } }])
                    .then(parent=>{
                        res.json(parent);
                    })
                })
        })

}

const removeParticipant = (req, res)=>{
    const { 
        parentType,
        parentId,
        participantType,
        participantId
    } = req.body;

    const Parent = ModelDict[parentType];
    Parent.findById(parentId)
        .then(parent=>{
            var participants = parent.participants;
            var participantIdSet = new Set(participants);
            participantIdSet.delete(participantId);
            parent.participants = Array.from(participantIdSet);

            var allTimeMembers = parent.allTimeMembers;
            allTimeMembers.filter(member=>(member.modelId!==participantId))
            
            if(allTimeMembers.length==0){
                parent.allTimeMembers = allTimeMembers.filter(member=>(member.modelId!==participantId));
            }

            parent.save()
                .then(parent=>{
                    Parent.findById(parentId)
                    .populate([{ path:'allTimeMembers.modelId',select:'name displayName wallet model',populate:{
                        path:'displayPicture',model:'File',select:'url thumbUrl'
                    } }])
                    .then(parent=>{
                        res.json(parent);
                    })
                })
        })

}

module.exports = {
    addParticipant,
    removeParticipant
}