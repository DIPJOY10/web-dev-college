var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const SubTaskSchema = new mongoose.Schema({

    task:{
        type: Schema.Types.ObjectId,
        ref: 'Task'   
    },

    title: {
        type: String,
        default: ''
    },

    done:{
        type: Boolean,
        default: ''
    },

    subTasks:[{
        type: Schema.Types.ObjectId,
        ref: 'SubTask'
    }]


},
{
  timestamps: true
})

var SubTask = mongoose.model('SubTask', SubTaskSchema);

module.exports = SubTask;