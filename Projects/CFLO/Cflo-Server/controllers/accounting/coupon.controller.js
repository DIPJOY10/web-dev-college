const async = require('async');
const Coupon = require('../../models/wallet.coupon.model')
const Transaction = require('../../models/wallet.transaction.model')

const defaultCoupons = async ()=>{
    const couponArr = [
        {
            type: 'Fix',
            amount:0,
            code:'LetsGoBrandon'
        },
        {
            type: 'Fix',
            amount:100,
            code:'Pay100Pilot'
        },
        {
            type: 'Fix',
            amount:500,
            code:'Pay500Pilot'
        },
        {
            type: 'Fix',
            amount:1000,
            code:'Pay1000Pilot'
        },
    ];

    const oldCoupons = await Coupon.find({})

    if(oldCoupons.length > 0){
        return oldCoupons;
    }else{
        const coupons = await Coupon.insertMany(couponArr)

        return coupons;
    }
}

const create = async (req, res) => {

    try {
        var code = req.body.code;

        var coupons = await Coupon.find({ code: code })

        if(coupons.length > 0) {
            
            res.json({
                status:400,
                data: null,
                error: 'Coupon already exists'
            })

        } else{
            var coupon = new Coupon(req.body);

            coupon = await coupon.save()
    
            
            res.json({
                status:200,
                data: coupon
            })
        }


    } catch (error) {
        res.json({
            status:400,
            data: null,
            error
        })
    }

}

const processCoupon = async (couponId, baseAmount)=>{
    const coupon = await Coupon.findById(couponId)
    var amount = baseAmount
    switch (coupon.type) {
        case 'Fix':
            amount = coupon.amount
            break;
     
        case 'Subtract':
            if(subtractType=='$'){
                amount = baseAmount - coupon.amount
            }else{
                amount = baseAmount - (100 - coupon.percentage)/100
            }
            break;

        default:
            break;
    }

    return amount>0?amount:0;
}

const update = (req, res) => {
    var couponObject = req.body;
    var couponId = couponObject._id;

    Coupon.findByIdAndUpdate(couponId, couponObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
             
                res.json({
                    status: 200,
                    data: resp
                });
                
            }

        })
}

const getCoupon = async (req, res) =>{
    var code = req.body.code;
    console.log(code)
    var coupons = await Coupon.find({ code: code })

    if(coupons.length>0){
  

        var resObject = {
            status: 200,
            data: coupons[0]
        }

        res.json(resObject)
    }else{
        res.json({
            status:400,
            data:null,
        })
    }


}



module.exports = {
    defaultCoupons,
    create,
    update,
    getCoupon,
    processCoupon
}