var mongoose = require('mongoose');

var Schema = mongoose.Schema;

// Keep global project settings here

const TopProjectInfoSchema = new mongoose.Schema({

    owner:{
        type: Schema.Types.ObjectId,
        refPath: 'ownerModelName'
    },

    ownerModelName:{
        type:String
    },  

    topProjectTeam:{
        type: Schema.Types.ObjectId,
        ref:'Team'      
    },



    /**
     *  Commented because implementing this is too much
     *  work without special benefits
     */

    // teams:[{
    //     type: Schema.Types.ObjectId,
    //     ref:'Team'      
    // }],

    // participants:[{
    //     type: Schema.Types.ObjectId,
    //     ref:'User'    
    // }],

    // teamParticipants:{
    //     type: Map,
    //     of: String
    // },

    // participantTeamAndRoles:{
    //     type: Map,
    //     of: String
    // },

})

var TopProjectInfo = mongoose.model('TopProjectInfo', TopProjectInfoSchema);

module.exports = TopProjectInfo;