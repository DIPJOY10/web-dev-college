const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const EmailInviteSchema = new Schema(
  {

    inviteId:{
      type: String,
    },

    email: {
      type: String
    },

    team:{
        type: Schema.Types.ObjectId,
        ref: 'Team'  
    },

    status:{
        type:Boolean,
        default:false
    },

    invitee: {
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'inviteeModel'
    },

    inviteeModel: {
        type: String,
        required: true,
        enum: ['User', 'Organization']
    },

    role:{
        type: String,
        enum:['Owner','Admin','Editor','Viewer']
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    invitedById:{
        type: Schema.Types.ObjectId,
        required: true,
        refPath: 'invitedByModel'     
    },

    invitedByModel:{
        type: String,
        required: true,
        enum: ['User', 'Organization']          
    } 

  },
  {
    timestamps: true
  }
);


const EmailInvite = model('EmailInvite', EmailInviteSchema);

module.exports = EmailInvite;