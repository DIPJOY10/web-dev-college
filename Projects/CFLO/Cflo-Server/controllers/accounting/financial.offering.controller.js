const ChartAccount = require('../../models/wallet.chart.account.model')
const Wallet = require('../../models/wallet.model')
const Offering = require('../../models/wallet.offering.model')
const OfferingRelation = require('../../models/wallet.offering.relation.model')



const getOfferingRelationByWallet = async (req, res) => {
    var walletId = req.body.walletId

    var data = await OfferingRelation.find({ wallet: walletId })
        .populate('offering')
        .populate('chartAccount')
        .populate({
            path :'addedBy',
            select:'parent parentModelName', 
            populate :{
                path: 'parent',
                select:'displayName'
            }
        })
        .populate({
            path: 'vendor', 
            select: 'parent parentModelName', 
            populate: {
                path: 'parent', 
                select: 'displayName'
            }
        })
    res.json({
        status: 200,
        data
    })
}

const updateOfferingRelation = async (req, res) => {
    const offeringRelationId = req.body._id;
    const walletId = req.body.wallet
    const offeringId = req.body.offeringId
    const offeringCreater = req.body.offeringCreater

    const offerinfRelationObject = {
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        chartAccount : req.body.chartAccount,
        taxRate : req.body.taxRate
    }

    const offeringObj = {
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
    } 

    await OfferingRelation.findByIdAndUpdate(offeringRelationId, offerinfRelationObject, { new: true },
        async (err, updatedRelation)=> {
            if (err) {
                console.log(err)
            } else {
                if(walletId === offeringCreater){
                    await Offering.findByIdAndUpdate(offeringId, offeringObj, { new: true },
                        (err, updatedOffering)=>{
                            console.log(updatedOffering)
                            res.json({
                                status: 200,
                                data: {
                                    updatedRelation,
                                    updatedOffering
                                }
                            });
                    })
                }else{
                    res.json({
                        status: 200,
                        data:{
                             updatedRelation,
                             updatedOffering : null
                            }
                    });
                }
            }
        })
}

const basicService = {
    name: "Misc Service",
    description: "Default service",
    model: "Service",
    default: true,
    price: 0,
}


const getDefaultServiceAndCreate = async () => {

    const getDefultValues = await Offering.find({ default: true })

    if (getDefultValues.length === 0) {

        const newDefaultServiceObj = new Offering(basicService)
        const savedData = await newDefaultServiceObj.save()
        console.log(savedData)

    } else {
        console.log("default tax and service exist")
    }
}


const createDefaultOfferingRelation = async (walletId) => {
    try {
        const getDefultService = await Offering.findOne({ default: true })


        const ChartAccounts = await ChartAccount.find({
            $and: [
                { wallet: walletId },
                {
                    $or:
                        [
                            { qbType: 'ServiceFeeIncome', name: 'Rental Income' },
                            { qbType: 'OtherBusinessExpenses', name: 'Other' }
                        ]
                },
            ],
        })

        let billServiceChartAccountId = null
        let invoiceServiceChartAccountId = null


        ChartAccounts.length > 0 && ChartAccounts.map((chartAccount) => {
            if (chartAccount?.qbType === 'OtherBusinessExpenses' && chartAccount?.name === 'Other') {
                billServiceChartAccountId = chartAccount._id
            }

            if (chartAccount?.qbType === 'ServiceFeeIncome' && chartAccount?.name === 'Rental Income') {
                invoiceServiceChartAccountId = chartAccount?._id
            }
        })

        let servicesRelationArr = []


        const defaultBillServiceRelation = new OfferingRelation({
            offering: getDefultService._id,
            chartAccount: billServiceChartAccountId,
            doYouOwnIt: false,
            taxRate: 0,
            price: 0,
            name: "Misc Service",
            description: "Default service",
            model: "Service",
            wallet: walletId,
        })

        const defaultInvoiceServiceRelation = new OfferingRelation({
            offering: getDefultService._id,
            chartAccount: invoiceServiceChartAccountId,
            doYouOwnIt: true,
            taxRate: 0,
            price: 0,
            name: "Misc Service",
            description: "Default service",
            model: "Service",
            wallet: walletId,
        })

        servicesRelationArr.push(defaultBillServiceRelation)
        servicesRelationArr.push(defaultInvoiceServiceRelation)

        console.log(servicesRelationArr)

        const savedData = await OfferingRelation.insertMany(servicesRelationArr)

        return savedData

    } catch (err) {
        return null
    }
}



const offeringCreateHelper = async (data) => {
    try {
        const newOffering = new Offering(data);
        const savedOffering = await newOffering.save()
        return savedOffering;
    } catch (err) {
        return null
    }
}



const createOffering = async (req, res) => {
    try {
        console.log(req.body)
        await offeringCreateHelper(req.body)
            .then((data) => {
                res.json({
                    status: 200,
                    data
                })
            })
            .catch((err) => {
                res.json({
                    status: 400,
                    data: null,
                    err
                })
            })
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}

const createOfferingWithRelation = async (req, res) => {
    try {
        console.log(req.body.offeringRelation)

        const newOfferingWithRelation = new OfferingRelation(req.body.offeringRelation);
        const savedOfferingRelation = await newOfferingWithRelation.save()

        res.json({
            status: 200,
            data: savedOfferingRelation
        })
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}


const getOfferingWithRelation = async (req, res) => {
    try {
        const walletId = req.body.walletId
        const own = req.body.own

        const offeringWithRelations = await OfferingRelation.find({ wallet: walletId, doYouOwnIt: own })
            .populate("offering")
            .populate("chartAccount")

        if (offeringWithRelations.length > 0) {

            console.log("have offeringRelations")
            console.log(offeringWithRelations)

            res.json({
                status: 200,
                data: offeringWithRelations
            })
        } else {

            console.log("don't have offeringRelations")
            console.log(offeringWithRelations)

            await createDefaultOfferingRelation(walletId)
                .then((data) => {
                    let sentData = []

                    data.length > 0 && data.map((d) => {
                        if (d.doYouOwnIt === own) {
                            sentData.push(d)
                        }
                    })

                    res.json({
                        status: 200,
                        data: sentData
                    })
                })
                .catch((err) => {
                    res.json({
                        status: 400,
                        data: null,
                        err
                    })
                })
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}


const getOfferingByName = async (req, res) => {
    try {
        console.log(req.body.name)
        var name = new RegExp(req.body.name, "ig")
        console.log(name)

        await Offering.find({ "name": name, default : false  })
            .limit(15)
            .exec((err, offerings) => {
                res.json({
                    status: 200,
                    data: offerings
                })
            });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}

const createOfferingAndRelation = async (req, res) => {
    try {
        let offeringData = req.body.newOffering
        let relationData = req.body.offeringRelation

        offeringCreateHelper(offeringData)
            .then(async (savedOffering) => {

                console.log("offeringAndRelation")
                console.log(savedOffering)

                relationData.offering = savedOffering?._id
                const newRelation = new OfferingRelation(relationData)
                const savedRelation = await newRelation.save()

                res.json({
                    status: 200,
                    data:
                    {
                        savedRelation,
                        savedOffering
                    }
                })
            })
            .catch((err) => {
                res.json({
                    status: 400,
                    data: null,
                    err
                })
            })
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}







module.exports = {
   
    updateOfferingRelation,


    getOfferingRelationByWallet,
    getDefaultServiceAndCreate,
    createOffering,
    createOfferingWithRelation,
    getOfferingWithRelation,
    getOfferingByName,
    createOfferingAndRelation,
}
