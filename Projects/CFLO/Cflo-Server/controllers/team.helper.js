const Team = require('../models/team.model')

const basicHelper = (req ,res ,parent)=>{
    

    var projectBasic = new Team({
        title:req.body.title,
        description:req.body.description            
    })

    projectBasic.save()
    .then(projectBasic=>{
        parent.basic = projectBasic._id;
        parent.save()
            .then(parent=>{
                parent.basic = projectBasic;
                
                res.json({
                    status:'200',
                    result:parent            
                })
            })
        
    })
}

module.exports = {
    basicHelper
}