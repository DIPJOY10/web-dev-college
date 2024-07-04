const User = require("../../models/user.model");
const Team = require("../../models/team.model");
const Organization = require("../../models/organization.model");
const mongoose = require("mongoose");
const async = require("async");
const _ = require("lodash");
const Wallet = require("../../models/wallet.model");
const Transaction = require("../../models/wallet.transaction.model");
const {
    createBasicChartAccts
} = require("./chart.account.controller");
const ChartAccount = require("../../models/wallet.chart.account.model");
const BillingAccount = require("../../models/wallet.billing.account");
const BankAccount = require("../../models/wallet.bank.account.model");
const { result } = require("lodash");

const keys = require("../../keys/keys");

const stripe = require("stripe")(keys.secretKey);

var modelMap = {
    Team,
    User,
};

const addConnectionHelper = async (type, walletId, profileId) => {
    var wallet = await Wallet.findById(walletId);
    switch (type) {
        case "Employee":
            var oldMembers = wallet.employees || [];
            wallet.employees = _.concat(oldMembers, [profileId]);
            break;

        case "Contractor":
            var oldMembers = wallet.contractors || [];
            wallet.contractors = _.concat(oldMembers, [profileId]);
            break;

        case "Vendor":
            var oldMembers = wallet.vendors || [];
            wallet.vendors = _.concat(oldMembers, [profileId]);
            break;

        case "Customer":
            var oldMembers = wallet.customers || [];
            wallet.customers = _.concat(oldMembers, [profileId]);
            break;

        case "Investor":
            var oldMembers = wallet.investors || [];
            wallet.investors = _.concat(oldMembers, [profileId]);
            break;

        case "Lender":
            var oldMembers = wallet.lenders || [];
            wallet.lenders = _.concat(oldMembers, [profileId]);
            break;

        default:
            break;
    }

    var savedWallet = await wallet.save();
    return savedWallet;
};

const addConnection = async (req, res) => {
    var type = req.body.type;
    var walletId = req.body.walletId;
    var profileId = req.body.profileId;
    var wallet = await addConnectionHelper(type, walletId, profileId);
    res.json(wallet);
};

const createInAll = () => {
    async.parallel([
        function (callback) {
            User.find({}).then(parents => {
                async.map(parents, async function (parent, callback) {
                    var parentId = parent._id;

                    var wallet = new Wallet({
                        parent: parentId,
                        parentModelName: "User",
                    });

                    wallet = await wallet.save();

                    var parentObject = {
                        _id: parentId,
                        wallet: wallet._id,
                    };

                    User.findByIdAndUpdate(parentId, parentObject, { new: true }, function (err, resp) { });
                });
            });
        },
        async function (callback) {
            Organization.find({}).then(parents => {
                async.map(parents, async function (parent, callback) {
                    var parentId = parent._id;

                    var wallet = new Wallet({
                        parent: parentId,
                        parentModelName: "Organization",
                    });

                    wallet = await wallet.save();

                    var parentObject = {
                        _id: parentId,
                        wallet: wallet._id,
                    };

                    Organization.findByIdAndUpdate(parentId, parentObject, { new: true }, function (err, resp) { });
                });
            });
        },
        async function (callback) {
            Team.find({}).then(parents => {
                async.map(parents, async function (parent, callback) {
                    var parentId = parent._id;

                    var wallet = new Wallet({
                        parent: parentId,
                        parentModelName: "Team",
                    });

                    wallet = await wallet.save();

                    var parentObject = {
                        _id: parentId,
                        wallet: wallet._id,
                    };

                    Team.findByIdAndUpdate(parentId, parentObject, { new: true }, function (err, resp) { });
                });
            });
        },
    ]);
};

const getParent = (parent, parentModelName) => {
    return new Promise((resolve, reject) => { });
};

const create = async (parentId, parentModelName, email, displayName, address) => {
    // const customer = await stripe.customers.create({
    //     email: email,
    //     name: displayName,
    //     address: address,
    // });

    var wallet = new Wallet({
        parent: parentId,
        parentModelName,
        // stripeCustomerId: customer?.id,
    });

    await wallet.save();

    if (parentModelName !== "Pal") {
        console.log(parentModelName);

        const accts = await createBasicChartAccts(wallet._id);
    }
    // donot save accts in wallet
    return wallet;
};

const update = walletObject => {
    var walletId = walletObject._id;

    return Wallet.findByIdAndUpdate(walletId, walletObject, { new: true }, function (err, resp) {
        if (err) {
            console.log(err);
        } else {
            return resp;
        }
    });
};

const updateWallet = async (req, res) => {
    try {
        const walletId = req.body.walletId;
        const walletObj = req.body;

        const updatedWallet = await Wallet.findByIdAndUpdate(walletId, walletObj, { new: true })
            .populate({
                path: "printLogo",
                model: "File",
                select: "url thumbUrl",
            })

        res.json({
            status: 200,
            data: updatedWallet,
        });
    } catch (err) {
        console.log(err)
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const getWallet = async (req, res) => {
    var walletId = req.body.wallet;
    const wallet = await Wallet.findById(walletId).populate("stripeCustomer");

    res.json(wallet);
};

const getWalletData = async (req, res) => {
    var walletId = req.body.walletId;

    if (mongoose.isValidObjectId(walletId)) {
        async.parallel(
            [
                function (callback) {
                    Wallet.findById(walletId)
                        .populate("stripeCustomer")
                        .populate("plaidBankAccounts")
                        .populate({
                            path: "parent",
                            populate: {
                                path: "parent",
                                select: "displayName displayPicture",
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        })

                        .then(wallet => {
                            console.log(wallet);

                            callback(null, wallet);
                        });
                },
                function (callback) {
                    Transaction.find({
                        wallets: { $in: [walletId] },
                    })
                        .populate({
                            path: "firstParty",
                            select: "displayName model wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        })
                        .populate({
                            path: "secondParty",
                            select: "displayName model wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        })
                        .then(transactions => {
                            callback(null, transactions);
                        });
                },
                function (callback) {
                    ChartAccount.find({ wallet: walletId }).then(chartAccounts => {
                        callback(null, chartAccounts);
                    });
                },
                function (callback) {
                    BillingAccount.find({
                        wallet: { $in: [walletId] },
                    })
                        .populate({
                            path: "wallet",
                            select: "parent parentModelName",
                            populate: { path: "parent", select: "displayName" },
                        })
                        .then(billingAccounts => {
                            callback(null, billingAccounts);
                        });
                },

                function (callback) {
                    BankAccount.find({ wallet: walletId })
                        .populate("account")
                        .then(bankAccounts => {
                            callback(null, bankAccounts);
                        });
                },
            ],

            function (err, results) {
                var wallet = results[0];

                var plaidBankAccounts = wallet.plaidBankAccounts || [];
                wallet.plaidBankAccounts = plaidBankAccounts.map(bankAcct => bankAcct._id);
                const transactions = results[1];
                const chartAccounts = results[2];
                const billingAccounts = results[3];
                const bankAccounts = results[4];

                res.json({
                    status: 200,
                    data: {
                        wallet,
                        transactions,
                        chartAccounts,
                        plaidBankAccounts,
                        billingAccounts,
                        bankAccounts,
                    },
                });
            }
        );
    } else {
        res.json({
            status: 400,
            data: null,
        });
    }
};

const changeTeamWallet = (teamId, walletId) => {
    return new Promise((resolve, reject) => {
        Team.findById(teamId).then(team => {
            console.log(teamId, walletId, " is the teamId walletId");
            var oldWalletId = team.wallet;
            team.wallet = walletId;
            team.save().then(team => {
                Wallet.findByIdAndDelete(oldWalletId).then(result => {
                    resolve({ newTeamWallet: team.wallet, walletId, oldWalletId });
                });
            });
        });
    });
};

const deleteSubTeamWallet = () => {
    Team.find({
        parentModelName: "Project",
    }).then(teams => {
        var i = 0;
        var topProjectTeams = [];
        var subProjectTeams = [];

        teams.map(team => {
            if (team.ancestors.length > 0) {
                subProjectTeams.push(team);
            } else {
                topProjectTeams.push(team);
            }
        });

        var topProjectTeamIds = topProjectTeams.map(team => {
            return "" + team._id;
        });
        var projectTeamDict = {};
        topProjectTeams.map(team => {
            var teamId = team._id;
            projectTeamDict[teamId] = team;
        });

        var timer = setInterval(() => {
            var curr = subProjectTeams.slice(i, i + 3);
            i = i + 3;
            console.log(curr.length, " is the curr", i);
            async.map(
                curr,
                function (subTeam, callback) {
                    var ancestors = subTeam.ancestors.map(teamId => {
                        return "" + teamId;
                    });
                    var topTeamIds = _.intersection(topProjectTeamIds, ancestors);

                    if (topTeamIds && topTeamIds.length > 0) {
                        var topTeamId = topTeamIds[0];
                        var topTeam = projectTeamDict[topTeamId];

                        if (topTeam && topTeam.wallet) {
                            var walletId = topTeam.wallet;
                            var subTeamId = subTeam._id;
                            changeTeamWallet(subTeamId, walletId).then(teamObj => {
                                callback(null, teamObj);
                            });
                        }
                    }
                },
                function (err, results) {
                    console.log(JSON.stringify(results));
                }
            );
        }, 5000);

        if (i > subProjectTeams.length) {
            clearInterval(timer);
        }
    });
};


const getProfileByWallet = async (req, res) => {
    try {
        const walletId = req.body.walletId
        const walletData = await Wallet.findById(walletId)
            .populate({
                path: "parent",
                populate: {
                    path: "parent",
                },
            })

        let profileId

        if (walletData.parentModelName === "User") {

            profileId = walletData.parent.profile

        } else if (walletData.parentModelName === "Team") {
            if (walletData.parent.parentModelName === "Project") {

                profileId = walletData.parent.parent.profile

            } else if (walletData.parent.parentModelName === "Organization") {

                profileId = walletData.parent.parent.profile

            }
        }

        res.json({
            status: 200,
            data: profileId,
        });

    } catch (err) {
        res.json({
            status: 400,
            data: null,
        });
    }
}




module.exports = {
    addConnection,
    addConnectionHelper,
    createInAll,
    create,
    update,
    updateWallet,
    getWallet,
    deleteSubTeamWallet,
    getWalletData,
    getProfileByWallet
};
