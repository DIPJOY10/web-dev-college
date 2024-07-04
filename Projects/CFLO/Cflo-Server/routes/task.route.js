const { 

    create, 
    update,
    deleteTask,

} = require('../controllers/task.controller');

// const {
//     create:createMap,
//     getTaskMap,
//     update:updateMap
// } = require('../controllers/task.map.controller')

module.exports = app => {

    // app.post('/api/task/map/create', createMap);
    // app.post('/api/task/map/update', updateMap);
    // app.post('/api/task/map/get', getTaskMap);

    app.post('/api/task/update', update);
    app.post('/api/task/delete', deleteTask);
    app.post('/api/task/create', create);

}