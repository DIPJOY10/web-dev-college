const { addParticipant,removeParticipant } = require('../controllers/participant.controller');

module.exports = app => {
    app.post('/api/participant/add', addParticipant);
    app.post('/api/participant/remove', removeParticipant);
}