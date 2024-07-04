const { 
    getData
} = require('../controllers/dashboard.controller');

module.exports = app => {
    app.post('/api/dashboard/data',getData)
}