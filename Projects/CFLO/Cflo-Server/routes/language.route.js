const language = require('../controllers/language.controller');

module.exports = app=>{
    app.post('/api/languages/get',language);
}