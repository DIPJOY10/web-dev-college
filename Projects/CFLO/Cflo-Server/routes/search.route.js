const { 
    search, 
    searchPeople,
    searchProfile,
    getEntityByEmail,
    searchProfileList,
    getUserByName,
    getOrgByName
} = require('../controllers/search.controller')

module.exports = app => {
    app.post('/api/search/email',getEntityByEmail)
    app.post('/api/search',search)
    app.post('/api/searchPeople',searchPeople)
    app.post('/api/searchProfile',searchProfile)
    app.post('/api/searchProfileList',searchProfileList)

    app.post('/api/search/users', getUserByName)
    app.post('/api/search/org', getOrgByName)

} 