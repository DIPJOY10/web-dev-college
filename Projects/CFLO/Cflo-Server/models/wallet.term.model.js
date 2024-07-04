const  mongoose =  require('mongoose');

const { Schema, model } = mongoose;

const TermSchema = new Schema(
  {

    name: {
      type: String,
      default:''
    },
    isNumDays : {
      type : Boolean,
      default : false
    },
    numDays:{
        type: Number,
        default:0
    },
    isDayOfMonth : {
      type : Boolean,
      default : false
    },
    day : {
      type : Number,
      default : 0
    },
    month : {
      type : Number,
      defalut : 0
    },
    currency:{
        type: String,
        default:'usd'
    },

    wallet:{
        type: Schema.Types.ObjectId,
        ref: 'Wallet'
    },
    public :{
      type : Boolean,
      default : false
    },

    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    createdAt: {
        type: Date,
        default: Date.now
    }

  },
  {
    timestamps: true
  }
);


const Term = model('Term', TermSchema);

module.exports = Term;