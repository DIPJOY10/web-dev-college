const { create, update, deleteEvent } = require('../controllers/calendar.event.controller')

module.exports = app => {
    
    app.post('/api/calendar/event/create',create)
    app.post('/api/calendar/event/update',update)
    app.post('/api/calendar/event/delete',deleteEvent)

}