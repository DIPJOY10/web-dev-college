const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const CalendarEventSchema = new Schema(
  {

    title: {
      type: String,
      default:''
    },

    description: {
      type: String,
      default:''
    },

    deleted:{
      type: Boolean,
      default:false
    },

    /**
     * People attending the event
     */

    people:[{
        type: Schema.Types.ObjectId,
        ref: 'Profile'  
    }],

    scheduledStart:{
        type: Date,
        default: Date.now
    },

    durationMins:{
        type: Number,
        default:0
    },

    scheduledEnd:{
        type: Date,
        default: Date.now
    },

    parent:{
      type: Schema.Types.ObjectId,
      refPath:'parentModelName'      
    },


    parentModelName:{
        type:String 
    },  

    /**
     * Below is the profile of the user that created the event 
     */

    addedBy:{
        type: Schema.Types.ObjectId,
        ref: 'Profile'  
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

  },
  {
    timestamps: true
  }
);


const CalendarEvent = model('CalendarEvent', CalendarEventSchema);

module.exports = CalendarEvent;