const { 
    createDiscountOrTax,
    createDiscountOrTaxWithRelation,
    getDiscountOrTaxByName,
    createDiscountOrTaxAndRelation,
    getDiscountOrTaxWithRelation
} = require('../controllers/accounting/discountOrTax.controller');

module.exports = app => {
    app.post('/api/discountortax/create', createDiscountOrTax);
    app.post('/api/discountortax/newrelation/create', createDiscountOrTaxWithRelation);
    app.post('/api/discountortax/relation/get', getDiscountOrTaxWithRelation);
    app.post('/api/discountortax/get/byname', getDiscountOrTaxByName);
    app.post('/api/discountortax/create/discountortaxandrelation', createDiscountOrTaxAndRelation);
}