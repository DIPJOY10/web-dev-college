const Pal = require('../models/pal.model');
const Profile = require('../models/profile.model')
const Wallet = require('../models/wallet.model')
const keys = require('../keys/keys');
const stripe = require("stripe")(keys.secretKey);
const { create: createWallet } = require("./accounting/wallet.controller");
const { addRelationHelper } = require('./accounting/financial.relation.controller');




const create = async (req, res) => {
    var pal = new Pal(req.body);

    console.log(req.body)

    var profile = new Profile({
        parent: pal._id,
        parentModelName: 'Pal',
    })


    const name = req?.body?.displayName || "";
    const email = req?.body?.email || "";
    const address = req?.body?.address || {}

    var wallet = await createWallet(pal._id, 'Pal', email, name, address)


    try {
        pal.profile = profile._id

        await profile.save()

        pal.wallet = wallet._id
        await wallet.save()

        pal = await pal.save();

        Profile.findById(profile._id)
            .populate({
                path: 'parent',
                populate: {
                    path: 'displayPicture',
                    model: 'File',
                    select: 'url thumbUrl'
                }
            })
            .populate({
                path: "parent",
                populate: {
                    path: "wallet",
                    model: "Wallet",
                },
            })
            .then(profile => {

                console.log(profile, ' is the profile')

                res.json({
                    status: 200,
                    data: profile
                })
            })


    } catch (error) {

        res.json({
            status: 400,
            data: null,
            error
        })

    }
}

const getPals = async (req, res) => {

    try {

        await Pal.find({
            parent: req.body.parent,
            parentModelName: req.body.parentModelName
        })
            .populate({
                path: 'profile', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            }).then(pals => {
                var palArr = pals.map(e => e.profile) || []
                res.json(palArr)
            })

    } catch (error) {

    }

}

module.exports = {
    create,
    getPals
}