const BrandApp = require('../../models/brand.app.model')
const Team = require('../../models/team.model');
var _ = require('lodash');
const Checkout = require('../../models/checkout.model');
const {
    createPaymentIntentHelper,
    updatePaymentIntentHelper,
    getPaymentIntentHelper,
} = require('../accounting/stripe.controller');
const BrandAppNetwork = require('../../models/brand.app.network.model');
const async = require('async');
const Transaction = require('../../models/wallet.transaction.model');
const Coupon = require('../../models/wallet.coupon.model');
const Profile = require('../../models/profile.model');
const { processCoupon } = require('../accounting/coupon.controller');


const create = async (req, res) => {
    try {

        console.log(req.body)

        var brandApp = new BrandApp(req.body)

        // const profileId = brandApp.ownerShip

        // const profile = await Profile.findById(profileId)
        //     .populate({
        //         path:'profile',populate:{ path:'parent'}
        //     })



        // const wallet = profile.parent && profile.parent.wallet

        await brandApp.save()


        // brandApp = await createAppTxHelper({ 
        //     brandApp, 
        //     wallet: wallet, 
        //     amount: 200
        // })

        res.json({
            status: 200,
            data: brandApp
        })

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }
}

const getProfileApps = async (req, res) => {
    try {
        const profileId = req.body.profileId
        const apps = await BrandApp.find({ access: { "$in": [profileId] } })
            .populate('transaction')
            .populate('displayPicture')
            .populate({
                path: "accessRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })


        res.status(200).json({
            data: apps
        })

    } catch (error) {

        res.json({
            status: 400,
            data: null,
            error
        })

    }

}


const getAppTx = async (req, res) => {

    const appId = req.body.appId;
    const amount = req.body.amount;
    const wallet = req.body.wallet;

    if (amount && appId && wallet) {

        var brandApp = await BrandApp.findById(appId)
            .populate('transaction')

        if (brandApp.transaction) {

            // if transaction is already there then check if amount is same as old

            if (transaction.amount == amount) {

                return res.json({
                    status: 200,
                    data: brandApp
                })


            } else {

                // update the transaction amount along with stripe payment intent



            }
        } else {

            // if transaction is not 

            const app = await createAppTxHelper({ brandApp, amount, wallet })
            res.json({
                status: 200,
                data: app
            })

        }


    } else {

        res.json({
            status: 400,
            data: null,
            error: 'Something went wrong'
        })

    }

}

const createAppTxHelper = async ({ brandApp, amount, wallet }) => {
    const user = brandApp.user;
    const profile = brandApp.ownerShip;
    var tx = new Transaction({
        amount,
        type: 'Payment',
        user,
        firstPartyWallet: wallet,
        firstParty: profile,
        paymentProvider: 'Stripe',
        paymentType: 'Platform'
    })


    const paymentIntent = await createPaymentIntentHelper({
        amount: amount * 100,
        currency: 'usd',
        automatic_payment_methods: {
            enabled: true,
        }
    })


    tx.stripePaymentIntent.intentId = paymentIntent.id;
    tx.stripePaymentIntent.clientSecret = paymentIntent.client_secret;
    tx = await tx.save()
    brandApp.transaction = tx._id
    await brandApp.save()
    brandApp.transaction = t
    return brandApp
}

const updateAmount = async (req, res) => {

    const amount = req.body.amount
    const couponId = req.body.coupon;
    const appId = req.body.appId

    console.log(amount)
    console.log(couponId)
    console.log(appId)


    const app = await BrandApp.findById(appId).populate('transaction')
    console.log(app);
    const tx = app.transaction
    var newAmount = amount;

    if (couponId) {
        newAmount = await processCoupon(couponId, amount)
    }

    const txId = tx._id

    const newTx = await Transaction.findByIdAndUpdate(txId, {
        _id: txId, amount: newAmount
    })

    await updatePaymentIntentHelper(tx, newAmount * 100)

    res.status(200).json({
        data: {
            tx: newTx
        },
    })

}




const appPaid = async (req, res) => {
    try {
        const appId = req.body.appId
        const txId = req.body.transactionId

        const paymentType = req.body.paymentType
        const paymentProvider = req.body.paymentProvider
        const achBankPaymentAccount = req.body.achBankPaymentAccount
        const clientSecret = req.body.client_secret
        const intentId = req.body.intentId


        var tx = await Transaction.findById(txId)

        const stripePaymentIntent = await getPaymentIntentHelper(intentId)

        console.log("stripe : - " + stripePaymentIntent)

        if (stripePaymentIntent.status == 'succeeded') {

            var app = await BrandApp.findById(appId)
            app.paid = true
            await app.save()

            const stripeObj = {
                intentId,
                clientSecret
            }

            tx.amountPaid = tx.amount;
            tx.status = 'Paid'
            tx.paymentType = paymentType
            tx.paymentProvider = paymentProvider
            tx.achBankPaymentAccount = achBankPaymentAccount
            tx.stripePaymentIntent = stripeObj

            await tx.save()

            app.transaction = tx

            res.json({
                status: 200,
                data: app
            })
        }

    } catch (error) {
        res.json({
            status: 400,
            data: null
        })
    }

}

const addCoupon = async (req, res) => {
    const code = req.body.code
    const coupons = await Coupon.find({ code: code })

    if (coupons.length > 0) {

    } else {

    }
}

const attach = async (req, res) => {
    try {

        const brandAppId = req.body.brandAppId
        const teamId = req.body.teamId

        var team = await Team.findById(teamId)

        const oldAttachedAppIds = team.attachedApps || []

        team.attachedApps = _.concat(oldAttachedAppIds, [brandAppId])

        await team.save()

        res.json({
            status: 200,
            data: {
                team
            }
        })

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }
}


const detach = async (req, res) => {
    try {

        const brandAppId = req.body.brandAppId
        const teamId = req.body.teamId

        var team = await Team.findById(teamId)

        const oldAttachedAppIds = team.attachedApps || []

        team.attachedApps = _.difference(oldAttachedAppIds, [brandAppId])

        await team.save()

        res.json({
            status: 200,
            data: {
                team
            }
        })

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }
}

const getAppById = async (req, res) => {

    try {
        const appId = req.body.appId;
        const brandApp = await BrandApp.findById(appId)
            .populate({
                path: 'ownerShip',
                populate: {
                    path: 'parent',
                    populate: {
                        path: 'displayPicture',
                        model: 'File',
                        select: 'url thumbUrl'
                    }
                }
            })
            .populate({
                path: 'transaction',
                model: 'Transaction',
                select: 'stripePaymentIntent'
            })
            .populate('displayPicture')
            .populate({
                path: "accessRole",
                model: 'AccessRole',
                populate: {
                    path: "user",
                    select: 'parent parentModelName',
                    populate: {
                        path: 'parent',
                        select: 'name displayName wallet',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                }
            })

        res.json({
            status: 200,
            data: brandApp
        })

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }
}


const getTeamApps = (req, res) => {
    const teamIds = req.body.teamIds
    console.log(teamIds, ' is the teamIds')

    try {

        async.parallel({
            apps: function (callback) {
                BrandApp.find({
                    ownerShip: { $in: teamIds }
                })
                    .populate('checkout')
                    .then(apps => {
                        callback(null, apps);
                    })
            },
            appNetworks: function (callback) {
                BrandAppNetwork.find({
                    ownerTeam: { $in: teamIds }
                })

                    .then(appNetworks => {
                        callback(null, appNetworks);
                    })
            }
        }, function (err, results) {

            res.json({
                status: 200,
                data: results
            })
        });

    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error
        })
    }
}

const update = async (req, res) => {
    try {

        if (req.body && req.body.app && req.body.app._id) {
            const app = req.body.app


            const brandApp = await BrandApp.findByIdAndUpdate(app._id, app, { new: true })
                .populate({
                    path: 'ownerShip',
                    populate: {
                        path: 'parent',
                        populate: {
                            path: 'displayPicture',
                            model: 'File',
                            select: 'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path: 'transaction',
                    model: 'Transaction',
                    select: 'stripePaymentIntent'
                })
                .populate('displayPicture')
                .populate({
                    path: "accessRole",
                    model: 'AccessRole',
                    populate: {
                        path: "user",
                        select: 'parent parentModelName',
                        populate: {
                            path: 'parent',
                            select: 'name displayName wallet',
                            populate: {
                                path: 'displayPicture',
                                model: 'File',
                                select: 'url thumbUrl'
                            }
                        }
                    }
                })
            if (!brandApp) {
                res.json({
                    status: 400,
                    data: null,
                    error: 'Id not found '
                });
            } else {
                res.json({ status: 200, data: brandApp });
            }
        }

    } catch (error) {

        res.json({
            status: 400,
            data: null,
            error
        })
    }
};



module.exports = {
    create,
    update,
    updateAmount,
    attach,
    detach,
    appPaid,
    getAppById,
    getTeamApps,
    getProfileApps

}