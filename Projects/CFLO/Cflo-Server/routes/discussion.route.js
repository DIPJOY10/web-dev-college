const { 
    getTeamDiscussions,
    create, update, deleteDiscussion, getDiscussionsByIds } = require('../controllers/discussion.controller');

module.exports = app => {
    app.post('/api/discussion/getTeamDiscussions', getTeamDiscussions);
    app.post('/api/discussion/create', create);
    app.post('/api/discussion/update', update);
    app.post('/api/discussion/delete', deleteDiscussion);
    app.post('/api/discussion/getDiscussionsByIds', getDiscussionsByIds);
}