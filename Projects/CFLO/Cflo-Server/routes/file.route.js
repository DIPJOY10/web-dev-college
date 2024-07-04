const {
    upload,
    s3Resize, updateDeleteFiles,
    create, update, getFiles, updateFiles
} = require('../controllers/file.controller');

module.exports = app => {
    app.post('/api/file/upload', upload);
    app.post('/api/file/create', create);
    app.post('/api/file/update', update);
    app.post('/api/file/get', getFiles);
    app.post('/api/file/updateFiles', updateFiles);
    app.post('/api/file/s3Resize', s3Resize);
    app.post('/api/file/delete/by/update', updateDeleteFiles);
}