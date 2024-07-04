const async = require("async");
const _ = require("lodash");
const FinanceRelation = require("../../models/wallet.finance.relation.model");
const Wallet = require("../../models/wallet.model");

const findProfileRelationHelper = async (walletId, profileId) => {
    const financeRelations = await FinanceRelation.findOne({
        wallet: walletId,
        profile: profileId,
    });
    return financeRelations;
};

const findTypeRelationHelper = async (walletId, type) => {
    const financeRelations = await FinanceRelation.find({
        wallet: walletId,
        type: type,
    })
        .populate({
            path: "profile",
            select: "parentModelName parent",
            populate: {
                path: "parent",
                select: "address description displayName email wallet",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        })
        .populate({
            path: "profile",
            select: "parentModelName parent",
            populate: {
                path: "parent",
                select: "address description displayName email wallet",
                populate: {
                    path: "wallet",
                    model: "Wallet",
                    select: "stripeConnectAccountId defaultDwollaBankAccount",
                    populate: {
                        path: "defaultDwollaBankAccount",
                        model: "DwollaBankAccount",
                        select: "url",
                    },
                },
            },
        })

        .populate({
            path: "topComment",
            populate: {
                path: "user",
                select: "name displayName wallet model",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        });

    return financeRelations;
};

const findExistingRelationHelper = async (walletId, type, profileId) => {
    const financeRelations = await FinanceRelation.findOne({
        wallet: walletId,
        type: type,
        profile: profileId,
    });
    return financeRelations;
};

const findWalletRelationHelper = async walletId => {
    const financeRelations = await FinanceRelation.find({
        wallet: walletId,
    }).populate({
        path: "profile",
        select: "type profile wallet parent parentModelName",
        populate: {
            path: "parent",
            select: "name displayName wallet model displayPicture",
            populate: {
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            },
        },
    });

    return financeRelations;
};

const findProfileRelation = async (req, res) => {
    var walletId = req.body.walletId;
    var profileId = req.body.profileId;

    const financeRelations = await findProfileRelationHelper(walletId, profileId);
    res.json({
        status: 200,
        data: financeRelations,
    });
};

const findTypeRelation = async (req, res) => {
    const walletId = req.body.walletId;
    const type = req.body.type;
    const financeRelations = await findTypeRelationHelper(walletId, type);
    res.json({
        status: 200,
        data: financeRelations,
    });
};

const findExistingRelation = async (req, res) => {
    const walletId = req.body.walletId;
    const type = req.body.type;
    var profileId = req.body.profileId;

    const financeRelations = await findTypeRelationHelper(walletId, type, profileId);
    res.json({
        status: 200,
        data: financeRelations,
    });
};

const findWalletRelation = async (req, res) => {
    var walletId = req.body.walletId;
    const financeRelations = await findWalletRelationHelper(walletId);

    res.json({
        status: 200,
        data: financeRelations,
    });
};

const addRelationHelper = async relObj => {
    const finRels = await FinanceRelation.find({
        wallet: relObj.walletId,
        type: relObj.type,
        profile: relObj.profileId,
        addedBy: relObj?.addedBy || null,
        user: relObj?.user || null,
    });

    if (finRels && finRels.length > 0) {
        return {
            financeRelation: finRels[0],
        };
    } else {
        var finRel = new FinanceRelation(relObj);
        const financeRelation = await finRel.save();

        return {
            financeRelation,
        };
    }
};

const addRelation = async (req, res) => {
    const walletId = req.body.wallet;
    const profileId = req.body.profile;
    const type = req.body.type;

    console.log(req.body);

    const relationResult = await findExistingRelationHelper(walletId, type, profileId);

    if (relationResult) {
        res.json({
            status: 200,
            data: relationResult,
        });
    } else {
        var data = await addRelationHelper(req.body);

        res.json({
            status: 200,
            data,
        });
    }
};

const getFullRelationByWallet = async (req, res) => {
    try {
        const wallet = req.body.walletId;
        const finRels = await FinanceRelation.find({wallet: wallet})
            .populate({
                path: "profile",
                model: "Profile",
                populate: {
                    path: "parent",
                    select: "displayPicture type email displayName wallet",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "profile",
                model: "Profile",
                populate: {
                    path: "parent",
                    select: "displayPicture type email displayName wallet",
                    populate: {
                        path: "wallet",
                        model: "Wallet",
                    },
                },
            });

        let usersAndPalArr = [];

        finRels.length > 0 &&
            finRels.map(finRel => {
                if (finRel?.profile?._id && finRel?.profile?.parent?.wallet?._id) {
                    const newObj = {
                        profileId: finRel?.profile?._id,
                        displayName: finRel?.profile?.parent?.displayName,
                        displayPicture: finRel?.profile?.parent?.displayPicture,
                        profile: finRel?.profile,
                        email: finRel?.profile?.parent?.email,
                        wallet: finRel?.profile?.parent?.wallet,
                    };
                    usersAndPalArr.push(newObj);
                }
            });

        if (usersAndPalArr.length > 0) {
            res.json({
                status: 200,
                data: usersAndPalArr,
            });
        }
    } catch (err) {
        res.json({
            status: 200,
            data: null,
            err,
        });
    }
};
const getAllRelationsByProfile = async (req, res) => {
    try {
        const profile = req.body.profile;
        const finRels = await FinanceRelation.find({addedBy: profile})
            .populate({
                path: "profile",
                select: "parent parentModelName",
                model: "Profile",
                populate: {
                    path: "parent",
                    select: "displayPicture type email displayName wallet",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })

            .populate({
                path: "wallet",
                select: "parent parentModelName",
                model: "Wallet",
            });

        res.json({
            status: 200,
            data: finRels,
        });
    } catch (err) {
        res.json({
            status: 200,
            data: null,
            err,
        });
    }
};

module.exports = {
    findProfileRelationHelper,
    findProfileRelation,
    findTypeRelationHelper,
    findTypeRelation,
    findExistingRelationHelper,
    findExistingRelation,
    findWalletRelationHelper,
    findWalletRelation,
    addRelationHelper,
    addRelation,
    getFullRelationByWallet,
    getAllRelationsByProfile,
};
