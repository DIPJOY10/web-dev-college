const {
    createAccessRole,
    updateAccessRole,
    updateManyAccessRoleWithRental,
    createManyAccessRole
} = require('../controllers/access.role.controller');

module.exports = app => {
    app.post('/api/accessrole/create', createAccessRole);
    app.post('/api/accessroles/create/many', createManyAccessRole);
    app.post('/api/accessrole/update', updateAccessRole);
    app.post('/api/accessrole/update/many/withrental', updateManyAccessRoleWithRental);
}