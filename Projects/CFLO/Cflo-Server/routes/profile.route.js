const {
    createAndSetForUser,
    get, getProfiles,
    getProfile,
    getProfileParent,
    create, update,
    getUsers, getUserProfileDetail 
} = require('../controllers/profile.controller');

const { getProfileData, getAdminProfiles } = require('../controllers/profile.data.controller');

module.exports = app => {
    app.post('/api/profile/createAndSetForUser', createAndSetForUser)
    app.post('/api/profile/get', get)
    app.post('/api/profile/getData',getProfileData)
    app.post('/api/profile/getProfiles', getProfiles)

    app.post('/api/profile/getAdminProfiles', getAdminProfiles)


    app.post('/api/profile/getProfile', getProfile)

    app.post('/api/profile/getProfileParent', getProfileParent)
    app.post('/api/profile/create', create)
    app.post('/api/profile/update', update)
    app.post('/api/profile/users', getUsers)
    app.post('/api/profile/userProfileDetail', getUserProfileDetail)
}