const { createMany, getCats, createCategory } = require('../controllers/category.controller');

module.exports = app => {
    app.post('/api/category/createMany', createMany);
    app.post('/api/category/getCats', getCats);
    app.post('/api/create/category/new', createCategory);
}