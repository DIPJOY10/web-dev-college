const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const IssueTemplateJoinSchema = new Schema(
  {

    template:{
        type: Schema.Types.ObjectId,
        ref: 'IssueTemplate'
    },

    profile:{
      type: Schema.Types.ObjectId,
      ref: 'Profile'
    },

  },
  {
    timestamps: true
  }
);


const IssueTemplateJoin = model('IssueTemplateJoin', IssueTemplateJoinSchema);

module.exports = IssueTemplateJoin;