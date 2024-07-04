var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const TaskMapSchema = new mongoose.Schema({
    taskIds:[{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],

/**
 *  taskId:{
 *      status,
 *      team,
 *      dates {pS,pF,eS,eF,aS,aF }
 *      predecessors 
 *      children
 *  }
 */

    taskMap:{
        type: Map,
        of: String
    },

})

var TaskMap = mongoose.model('TaskMap', TaskMapSchema);

module.exports = TaskMap;