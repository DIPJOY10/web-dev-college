const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const FeedSchema = new Schema(
  {

    published:{
        type: Boolean,
        default:false
    },

    parent:{
      type: Schema.Types.ObjectId,
      refPath: 'parentModelName'
    },

    parentModelName:{
        type:String
    }

  },
  {
    timestamps: true
  }
);


const Feed = model('Feed', FeedSchema);

module.exports = Feed;