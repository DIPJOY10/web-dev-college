const { 
    create,
    update,
    getByIds
 } = require('../controllers/role.map.controller');
 
 module.exports = app => {
    app.post('/api/roleMap/create', create);
    app.post('/api/roleMap/update', update);
    app.post('/api/roleMap/getByIds',getByIds);
 }