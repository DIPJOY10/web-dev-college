var mongoose = require('mongoose');

var Schema = mongoose.Schema;

/**
 * Message Schema
 * Message belongs to Conversation Model Schema
 */

const MessageSchema = new mongoose.Schema({
  text: {
    type: String
  },
  files: [{
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

  link: {
    modelId: {
      type: Schema.Types.ObjectId,
      // Instead of a hardcoded model name in `ref`, `refPath` means Mongoose
      // will look at the `onModel` property to find the right model.
      refPath: 'ModelName'
    },
    ModelName: {
      type: String,
      enum: ['ProjectAction', 'Project', 'Group', 'Message',]
    },
    text: {
      type: String,
    }
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation'
  }
});

/**
 * Conversation Model Schema
 */



const ConversationSchema = new mongoose.Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },

  groupName: {
    type: String,
    default: 'Group A1'
  },

  groupDP: {
    type: Schema.Types.ObjectId,
    ref: 'File'
  },

  topMessage: {
    type: Schema.Types.ObjectId,
    ref: 'Message'
  },

  participants: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],

  participantsRole: [{
    type: Schema.Types.ObjectId,
    ref: 'AccessRole'
  }],

  teams: [{
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }],

  lastSeen: {
    type: Map,
    of: String
  },

  lastActive: {
    type: Date,
    default: Date.now
  },

  type: {
    type: String,
    default: 'Private',
    enum: ["Private", "CustomerCareBot", "Group"]
  },

}, {
  timestamps: true
});

var Message = mongoose.model('Message', MessageSchema);
var Conversation = mongoose.model('Conversation', ConversationSchema);

module.exports = {
  Message,
  Conversation
};
