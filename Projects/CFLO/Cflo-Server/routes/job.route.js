const {
    getJobTypes,
    getPropTypes,
    create,
    update,
    updateJobAndProjectCommon,
    getJob,
    getUserJobs,
    getJobDetail,
    getSavedJobs
} = require('../controllers/job.controller');

module.exports = app => {
    app.post('/api/job/getJobTypes', getJobTypes);
    app.post('/api/job/getPropTypes', getPropTypes);
    app.post('/api/job/create', create);
    app.post('/api/job/update', update);
    app.post('/api/job/getDetail', getJobDetail);
    app.post('/api/job/updateJobAndProjectCommon', updateJobAndProjectCommon);
    app.post('/api/job/getJob', getJob);
    app.post('/api/job/getUserJobs', getUserJobs);
    app.post('/api/job/getSavedJobs', getSavedJobs);
}