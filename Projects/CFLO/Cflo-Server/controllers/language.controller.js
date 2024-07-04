const language = require('../helpers/speak');

const getLanguages = (req,res)=>{
     res.json({
        data:language
    })
}

module.exports = getLanguages