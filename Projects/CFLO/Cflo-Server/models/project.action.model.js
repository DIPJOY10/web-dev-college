var mongoose = require('mongoose');

var Schema = mongoose.Schema;

const ProjectActionSchema = new mongoose.Schema({

    basic:{
        type: Schema.Types.ObjectId,
        ref: 'Basic'          
    },
    
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'      
    },

    module:{
        type: Schema.Types.ObjectId,
        ref: 'Folder'        
    },

    project:{
        type: Schema.Types.ObjectId,
        ref: 'Project'          
    }

})

var ProjectAction = mongoose.model('ProjectAction',ProjectActionSchema);

module.exports = ProjectAction;