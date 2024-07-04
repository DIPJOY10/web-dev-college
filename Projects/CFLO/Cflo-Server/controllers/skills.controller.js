const primaryJobs = require('../helpers/job.types');

const getSkills = (req,res)=>{
    res.json({
        data:primaryJobs
    })
}

module.exports = getSkills