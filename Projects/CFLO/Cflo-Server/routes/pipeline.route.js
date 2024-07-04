const { 
    create, update, deletePipeline,
    getPlatformPipelines, getUserPipelines ,getPipelines 
} = require('../controllers/pipeline.controller');

module.exports = app => {
    app.post('/api/pipeline/create', create);
    app.post('/api/pipeline/update', update);
    app.post('/api/pipeline/delete', deletePipeline);
    app.post('/api/pipeline/platform', getPlatformPipelines);
    app.post('/api/pipeline/user', getUserPipelines);
    app.post('/api/pipeline/get', getPipelines);
}