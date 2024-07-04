const { 
    getFeed
} = require('../controllers/feed.controller');

module.exports = app => {
    app.post('/api/feed/get', getFeed);
}