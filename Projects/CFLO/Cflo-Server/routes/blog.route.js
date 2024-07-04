const {
    create, update, deleteBlog,
    addPara, removePara, getPublicBlogs, getAllAdminBlogs,
    getBlog, blogPinUp
} = require('../controllers/blog.controller');

module.exports = app => {
    app.post('/api/blog/admin/create', create);
    app.post('/api/blog/admin/update', update);
    app.post('/api/blog/admin/delete', deleteBlog);
    app.post('/api/blog/admin/addPara', addPara);
    app.post('/api/blog/admin/removePara', removePara);
    app.post('/api/blog/admin/all', getAllAdminBlogs);
    app.post('/api/blog/all', getPublicBlogs);
    app.post('/api/blog/getBlog', getBlog);
    app.post('/api/blog/pinUpBlogs', blogPinUp);
}