const { create, update, getApps, getProfileApps, getApplicationDetail, getAppliedDetails, getApplications } = require('../controllers/apply.controller');

module.exports = app => {
    app.post('/api/apply/create', create);
    app.post('/api/apply/update', update);
    app.post('/api/apply/getApps', getApps);
    app.post('/api/apply/getProfileApps', getProfileApps);
    app.post('/api/apply/getApplicationDetail', getApplicationDetail);
    app.post('/api/apply/getAppliedDetails', getAppliedDetails);
    app.post('/api/apply/getApplications', getApplications);

}