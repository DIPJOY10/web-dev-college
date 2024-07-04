var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const TaskSchema = new mongoose.Schema({

    issue: {
        type: Schema.Types.ObjectId,
        ref: "Issue",
    },

    text: {
        type: String,
        default: ''
    },

    description: {
        type: String,
        default: ''      
    },

    closed: {
        type: Boolean,
        default: false,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

},
{
  timestamps: true
})

var Task = mongoose.model('Task', TaskSchema);

module.exports = Task;