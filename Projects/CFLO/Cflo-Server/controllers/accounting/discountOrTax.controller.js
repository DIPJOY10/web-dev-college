const Wallet = require('../../models/wallet.model')
const DisCountOrTax = require('../../models/wallet.discountOrTax.model')
const DiscountOrTaxRelation = require('../../models/wallet.discountOrTax.relation.model')
const ChartAccount = require('../../models/wallet.chart.account.model')



const basicDiscount = {
    name: "Default Discount",
    description: "Default discount",
    model: "Discount",
    type: "%",
    amount: 0,
    percent: 0,
    default: true
}

const basicTax = {
    name: "Default Tax",
    description: "Default Tax",
    model: "Tax",
    type: "%",
    amount: 0,
    percent: 0,
    default: true
}


const getDefaultDiscountAndTaxAndCreate = async () => {
    const getDefultValues = await DisCountOrTax.find({ default: true })

    if (getDefultValues.length === 0) {
        let discountOrTaxArr = []
        const newDefaultDisObj = new DisCountOrTax(basicDiscount)
        discountOrTaxArr.push(newDefaultDisObj)
        const newDefaultTaxObj = new DisCountOrTax(basicTax)
        discountOrTaxArr.push(newDefaultTaxObj)
        const savedData = await DisCountOrTax.insertMany(discountOrTaxArr)
        console.log(savedData)
    } else if (getDefultValues.length === 1 && getDefultValues[0].model === "Tax") {
        const discountObj = DisCountOrTax(basicDiscount)
        const savedData = await discountObj.save()
    } else if (getDefultValues.length === 1 && getDefultValues[0].model === "Tax") {
        const taxObj = DisCountOrTax(basicTax)
        const savedData = await taxObj.save()
    } else {
        console.log("default tax and discount exist")
    }
}


const createDefaultDiscountAndTaxRelation = async (walletId) => {
    try {
        const defaultDiscountAndTax = await DisCountOrTax.find({
                $and: [
                    {default: true},
                    {$or: 
                        [
                            { model: "Discount" }, 
                            { model: "Tax" }
                        ]
                    },
                ],
            })
 
        let discountId = null
        let taxId = null

        defaultDiscountAndTax.length>0 && defaultDiscountAndTax.map((discountOrTax)=>{

            if(discountOrTax?.model === "Discount"){
                discountId = discountOrTax._id
            }

            if(discountOrTax?.model === "Tax"){
                taxId = discountOrTax?._id
            }

        })


        const ChartAccounts = await ChartAccount.find({
            $and: [
                {wallet: walletId},
                {$or: 
                    [
                        { qbType: 'DiscountsRefundsGiven', name: 'Discount' }, 
                        { qbType: 'SaleTaxPayable', name: 'Tax' }
                    ]
                },
            ],
        })

        let discountChartAccountId = null
        let TaxChartAccountId = null


        ChartAccounts.length>0 && ChartAccounts.map((chartAccount)=>{

            if(chartAccount?.qbType === 'DiscountsRefundsGiven' && chartAccount?.name ==='Discount'){
                discountChartAccountId = chartAccount._id
            }

            if(chartAccount?.qbType === 'SaleTaxPayable' && chartAccount?.name ==='Tax'){
                TaxChartAccountId = chartAccount?._id
            }

        })

        let discountOrTaxRelationArr = []


        const defaultDiscountRelation = new DiscountOrTaxRelation({
            discountOrTax: discountId,
            chartAccount: discountChartAccountId,
            name: "Default Discount",
            description: "Default Discount",
            model: "Discount",
            type: "%",
            amount: 0,
            percent: 0,
            wallet: walletId,
        })

        const defaultTaxRelation = new DiscountOrTaxRelation({
            discountOrTax: taxId,
            chartAccount: TaxChartAccountId,
            name: "Default Tax",
            description: "Default Tax",
            model: "Tax",
            type: "%",
            amount: 0,
            percent: 0,
            wallet: walletId,
        })

        discountOrTaxRelationArr.push(defaultDiscountRelation)
        discountOrTaxRelationArr.push(defaultTaxRelation)

        console.log(discountOrTaxRelationArr)

        const savedData = await DiscountOrTaxRelation.insertMany(discountOrTaxRelationArr)

        return savedData

    } catch (err) {
        return null
    }
}



const discountOrTaxCreateHelper = async (data) => {
    try {
        const newDiscountOrTax = new DisCountOrTax(data);
        const savedDiscountOrTax = await newDiscountOrTax.save()
        return savedDiscountOrTax;
    } catch (err) {
        return null
    }
}



const createDiscountOrTax = async (req, res) => {
    try {
        console.log(req.body)

        const newDiscountOrTax = new DisCountOrTax(req.body);
        await newDiscountOrTax.save()

        res.json({
            status: 200,
            data: newDiscountOrTax
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

const createDiscountOrTaxWithRelation = async (req, res) => {
    try {
        console.log(req.body.discountOrTaxRelation)

        const newDiscountOrTaxWithRelation = new DiscountOrTaxRelation(req.body.discountOrTaxRelation);
        const savedDiscountOrTaxRelation = await newDiscountOrTaxWithRelation.save()

        console.log(savedDiscountOrTaxRelation)

        res.json({
            status: 200,
            data: savedDiscountOrTaxRelation
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


const getDiscountOrTaxWithRelation = async (req, res) => {
    try {
        const walletId = req.body.walletId

        const discountOrTaxWithRelations = await DiscountOrTaxRelation.find({ wallet: walletId })
            .populate("discountOrTax")
            .populate("chartAccount")


        if (discountOrTaxWithRelations.length > 0) {
            res.json({
                status: 200,
                data: discountOrTaxWithRelations
            })
        } else {
            await createDefaultDiscountAndTaxRelation(walletId)
                .then((data) => {
                    res.json({
                        status: 200,
                        data
                    })
                })
                .catch((err) => {
                    res.json({
                        status: 400,
                        data : null,
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


const getDiscountOrTaxByName = async (req, res) => {
    try {
        console.log(req.body.name)
        const model = req.body.model
        var name = new RegExp(req.body.name, "ig")

        console.log(name)
        console.log(model)

        await DisCountOrTax.find({ "name": name, "model": model })
            .limit(15)
            .exec((err, discountsOrTaxs) => {
                res.json({
                    status: 200,
                    data: discountsOrTaxs
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

const createDiscountOrTaxAndRelation = async (req, res) => {
    try {
        let discountOrTaxData = req.body.discountOrTax
        let relationData = req.body.discountOrTaxRelation
        discountOrTaxCreateHelper(discountOrTaxData)
            .then(async (savedDiscountOrTax) => {
                relationData.discountOrTax = savedDiscountOrTax?._id
                const newRelation = new DiscountOrTaxRelation(relationData)
                const savedRelation = await newRelation.save()

                res.json({
                    status: 200,
                    data:
                    {
                        savedRelation,
                        savedDiscountOrTax
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
    createDiscountOrTax,
    createDiscountOrTaxWithRelation,
    getDiscountOrTaxByName,
    createDiscountOrTaxAndRelation,
    getDefaultDiscountAndTaxAndCreate,
    getDiscountOrTaxWithRelation
}
