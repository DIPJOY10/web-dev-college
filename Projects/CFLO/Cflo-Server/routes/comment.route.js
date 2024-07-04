const { 

    create,

    createInParent,
    updateComment,
    deleteComment,
    getByIds,
    getComments
} = require('../controllers/comment.controller');

module.exports = app => {
    app.post('/api/comment/create', create);
    app.post('/api/comment/createInParent', createInParent);
    app.post('/api/comment/update', updateComment);
    app.post('/api/comment/delete', deleteComment);
    app.post('/api/comment/getComments', getComments);
    app.post('/api/comment/getByIds',getByIds);
}