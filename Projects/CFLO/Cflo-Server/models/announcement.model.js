var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Announcement Schema
 */

const AnnouncementSchema = new mongoose.Schema({
  text: {
    type: String
  },
  files:[{
      type: Schema.Types.ObjectId,
      ref: 'File'
  }],

  seen: {
    type: Boolean,
    default: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  link:{
    modelId: {
      type: Schema.Types.ObjectId,
      // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
      // will look at the `onModel` property to find the right model.
      refPath: 'ModelName'
    },
    ModelName: {
      type: String,
      enum: ['ProjectAction', 'Project', 'Group']
    },
    text:{
      type: String,
    }
  },

  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  Discussion:{
    type: Schema.Types.ObjectId,
    ref: 'Discussion'
  }
});

/**
 * Discussion Model Schema
 */

 const DiscussionSchema = new mongoose.Schema({
   creator: {
     type: Schema.Types.ObjectId,
     ref: 'User'
   },

   // newest message
   topAnnouncement:{
     type: Schema.Types.ObjectId,
     ref: 'Announcement'
   },
   /**
    * participants,includes the creator also
    */
   participants:[{
     type: Schema.Types.ObjectId,
     ref: 'User'
   }],


   lastSeen:{
        type: Map,
        of: String
    },


  lastActive: {
    type: Date,
    default: Date.now
  },

/**
 * Can be personal(Group),only these conversations will show in users chat
 * /or belong to a Model eg. Escrow,Loans
 */


    modelId: {
      type: Schema.Types.ObjectId,
      // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
      // will look at the `onModel` property to find the right model.
      refPath: 'ModelName'
    },
    ModelName: {
      type: String,
      enum: ['ProjectAction', 'Project', 'Group']
    },

    type:{
      type:String,
      default:'Private',
      enum:["Private","CustomerCareBot"]
    }


 },{
   timestamps:true
 });

var Announcement = mongoose.model('Announcement',AnnouncementSchema);

module.exports = Announcement;