const async = require('async');
var _ = require('lodash');
const BillItem = require('../../models/wallet.bill.item.model')
const BillList = require('../../models/wallet.bill.list.model')


const billListInitHelper = async (parentId, parentModelName, rate = 0) => {
    var billList = new BillList({
        parent: parentId,
        parentModelName
    })

    var billItem = new BillItem({
        offeringRelation: null,
        type: 'Service',
        name: '',
        description: '',
        qTy: 1,
        rate: rate,
        tax: false,
        billList: billList._id
    })

    billItem = await billItem.save()
    var billItemId = billItem._id
    billList.items = [billItemId]
    billList = await billList.save()
    billList.items = [billItem]
    return billList
}

const billListShortInvoiceHelper = async (memo, rate, invoiceId) => {
    var billList = new BillList({
        parent: invoiceId,
        parentModelName: 'Invoice'
    })

    var billItem = new BillItem({
        offeringRelation: null,
        type: 'Service',
        name: memo,
        description: '',
        qTy: 1,
        rate,
        tax: false,
        billList: billList._id
    })

    billItem = await billItem.save()
    var billItemId = billItem._id
    billList.items = [billItemId]
    billList = await billList.save()
    billList.items = [billItem]
    return billList
}


const update = (req, res) => {
    var billListObject = req.body;
    var billListId = billListObject._id;

    BillList.findByIdAndUpdate(billListId, billListObject, { new: true }, async (err, resp) => {
        if (err) {
            console.log(err)
        } else {

            const updatedBilList = await BillList.findOne({ _id: billListId })
                .populate({
                    path: "discountRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "discountOrTax",
                        model: "DisCountOrTax",
                    },
                })
                .populate({
                    path: "discountRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "chartAccount",
                        model: "ChartAccount",
                    },
                })
                .populate({
                    path: "taxRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "discountOrTax",
                        model: "DisCountOrTax",
                    },
                })
                .populate({
                    path: "taxRelationModel",
                    model: "DiscountOrTaxRelation",
                    populate: {
                        path: "chartAccount",
                        model: "ChartAccount",
                    },
                })

            res.json({
                status: 200,
                data: updatedBilList
            });
        }

    })
}

const updateItem = async (req, res) => {
    var billItemObject = req.body;
    var billItemId = billItemObject._id;

    try {
        const updatedItem = await BillItem.findByIdAndUpdate(billItemId, billItemObject, { new: true })
            .populate({
                path: "offeringRelation",
                model: "OfferingRelation",
                populate: {
                    path: "offering",
                    model: "Offering",
                },
            })
            .populate({
                path: "offeringRelation",
                model: "OfferingRelation",
                populate: {
                    path: "chartAccount",
                    model: "ChartAccount",
                },
            })
            .populate("chartAccount")

        res.json({
            status: 200,
            data: updatedItem
        })

    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err
        })
    }
}




const addListItem = async (req, res) => {
    var billListId = req.body.billListId
    try {
        var billItem = new BillItem({
            offeringRelation: null,
            type: 'Service',
            name: '',
            description: '',
            qTy: 1,
            rate: 0,
            tax: false,
            billList: billListId
        });
        var billItem = await billItem.save()

        var billList = await BillList.findById(billListId)

        var oldArray = billList.items;
        var billItemId = billItem._id;
        billList.items = _.concat(oldArray, [billItemId])
        console.log(billItem, oldArray, billList)
        billList = await billList.save()
        res.json({
            status: 200,
            data: {
                billList,
                billItem
            }
        })
    } catch (error) {
        console.log(error, ' is the error')
    }

}

const deleteItem = async (req, res) => {
    try {
        var itemId = req.body.itemId
        var billListId = req.body.billId
        var deleteRes = await BillItem.findByIdAndDelete(itemId);
        var billList = await BillList.findById(billListId)
        var oldArray = billList.items;
        oldArray = JSON.parse(JSON.stringify(oldArray));
        itemId = JSON.parse(JSON.stringify(itemId));
        billList.items = _.difference(oldArray, [itemId])

        billList = await billList.save()
        res.json({
            status: 200,
            data: {
                billList
            }
        })
    } catch (error) {
        console.log(error, ' is the error in bill item delete')
    }

}



module.exports = {
    billListInitHelper,
    billListShortInvoiceHelper,
    update,
    updateItem,
    addListItem,
    deleteItem
}