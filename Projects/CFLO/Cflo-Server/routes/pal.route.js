const { 
    create,
    getPals
} = require('../controllers/pal.controller');

module.exports = app => {
    app.post('/api/pal/create',create)
    app.post('/api/pal/getPals',getPals)
}