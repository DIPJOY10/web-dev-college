const { 
    create,
    update,
    deleteTxTemplate,
    getTxTemplate,
    getTxTemplateByWallet,
    updateScheduleData,
    createTemplateForRentalRelation,
    getTxTemplateByRentalRelation
} = require('../controllers/accounting/tx.template.controller');
const { getTemplates } = require('../controllers/issue.template.controller');

module.exports = app => {
    app.post('/api/txtemplate/create', create);
    app.post('/api/txtemplate/create/for/rentalrelation', createTemplateForRentalRelation);
    app.post('/api/txtemplate/update', update);
    app.post('/api/txtemplate/updateScheduleData', updateScheduleData);
    app.post('/api/txtemplate/delete', deleteTxTemplate);
    app.post('/api/txtemplate/get', getTxTemplate);
    app.post('/api/txtemplate/get/by/rentalrelation', getTxTemplateByRentalRelation);
    app.post('/api/txtemplate/bywalletget', getTxTemplateByWallet);
}