const getSkills = require('../controllers/skills.controller');

module.exports = app =>{
    app.post('/api/getSkills',getSkills);
}