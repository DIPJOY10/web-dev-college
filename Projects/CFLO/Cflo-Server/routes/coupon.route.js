const { 
    create, update, getCoupon
} = require('../controllers/accounting/coupon.controller');

module.exports = app => {

    app.post('/api/coupon/create', create);
    app.post('/api/coupon/update', update);
    app.post('/api/coupon/get', getCoupon);
 
}