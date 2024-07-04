const Project = require("../models/project.model")
const PurchaseCriteria = require("../models/purchase.criteria.model")
const PurchasePolicy = require("../models/purchase.policy.model")
const _ = require("lodash");
const async = require("async");
const { getAllAdminIdsHelper } = require("./project.controller");
const ComparedReport = require("../models/compared.report.model");



const createPurchasePolicy = async (req, res) => {
    try {
        const policyName = req.body.policyName
        const profileId = req.body.profileId

        let newPurchasePolicy = new PurchasePolicy({
            title: policyName,
            profile: profileId
        });

        let newBrrrrPurchaseCriteria = new PurchaseCriteria({
            purchasePolicy: newPurchasePolicy._id,
            type: "BRRRR",
            criteriaOnTotalCashNeededBool: true,
            criteriaOn70RuleBool: true,
            criteriaOn1RuleBool: true,
            criteriaOn50RuleBool: true,
            criteriaOnCashFlowBool: true,
            criteriaOnROIBool: true,
        });

        let newFlipPurchaseCriteria = new PurchaseCriteria({
            purchasePolicy: newPurchasePolicy._id,
            type: "Flip",
            criteriaOnTotalCashNeededBool: true,
            criteriaOn70RuleBool: true,
            criteriaOnROIBool: true,
        });

        let newRentalPurchaseCriteria = new PurchaseCriteria({
            purchasePolicy: newPurchasePolicy._id,
            type: "Rental",
            criteriaOnTotalCashNeededBool: true,
            criteriaOn70RuleBool: true,
            criteriaOn1RuleBool: true,
            criteriaOn50RuleBool: true,
            criteriaOnCashFlowBool: true,
            criteriaOnROIBool: true,
        });

        newPurchasePolicy.BRRRR = newBrrrrPurchaseCriteria._id
        newPurchasePolicy.Flip = newFlipPurchaseCriteria._id
        newPurchasePolicy.Rental = newRentalPurchaseCriteria._id

        let purchaseCriteriaArr = [newBrrrrPurchaseCriteria, newFlipPurchaseCriteria, newRentalPurchaseCriteria]

        await PurchaseCriteria.insertMany(purchaseCriteriaArr);
        await newPurchasePolicy.save()

        const populatedPolicy = await PurchasePolicy.findById(newPurchasePolicy?._id)
            .populate({
                path: "Rental",
                model: "PurchaseCriteria",
            })
            .populate({
                path: "BRRRR",
                model: "PurchaseCriteria",
            })
            .populate({
                path: "Flip",
                model: "PurchaseCriteria",
            })
            .populate({
                path: "profile",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName wallet",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                }
            })

        res.json({
            status: 200,
            data: populatedPolicy
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}

const findOrCreateAndAddPolicy = async (req, res) => {
    try {
        const profileId = req.body.profileId;
        const projectId = req.body.projectId;
        const userOrOrgName = req.body.userOrOrgName;
        let policyId = null

        const defaultPolicy = await PurchasePolicy.findOne({ profile: profileId, isDefault: true })
        if (defaultPolicy) {
            console.log("Find policy")
            policyId = defaultPolicy?._id;
        } else {
            console.log("Create policy")
            const defaultName = "defaultPolicy_" + userOrOrgName

            let newPurchasePolicy = new PurchasePolicy({
                title: defaultName,
                isDefault: true,
                profile: profileId
            });

            let newBrrrrPurchaseCriteria = new PurchaseCriteria({
                purchasePolicy: newPurchasePolicy._id,
                type: "BRRRR",
                criteriaOnTotalCashNeededBool: true,
                criteriaOn70RuleBool: true,
                criteriaOn1RuleBool: true,
                criteriaOn50RuleBool: true,
                criteriaOnCashFlowBool: true,
                criteriaOnROIBool: true,
            });

            let newFlipPurchaseCriteria = new PurchaseCriteria({
                purchasePolicy: newPurchasePolicy._id,
                type: "Flip",
                criteriaOnTotalCashNeededBool: true,
                criteriaOn70RuleBool: true,
                criteriaOnROIBool: true,
            });

            let newRentalPurchaseCriteria = new PurchaseCriteria({
                purchasePolicy: newPurchasePolicy._id,
                type: "Rental",
                criteriaOnTotalCashNeededBool: true,
                criteriaOn70RuleBool: true,
                criteriaOn1RuleBool: true,
                criteriaOn50RuleBool: true,
                criteriaOnCashFlowBool: true,
                criteriaOnROIBool: true,
            });

            newPurchasePolicy.BRRRR = newBrrrrPurchaseCriteria._id
            newPurchasePolicy.Flip = newFlipPurchaseCriteria._id
            newPurchasePolicy.Rental = newRentalPurchaseCriteria._id

            let purchaseCriteriaArr = [newBrrrrPurchaseCriteria, newFlipPurchaseCriteria, newRentalPurchaseCriteria]

            await PurchaseCriteria.insertMany(purchaseCriteriaArr);
            await newPurchasePolicy.save()

            policyId = newPurchasePolicy._id
        }

        const updatedProject = await Project.findByIdAndUpdate(projectId, { purchasePolicy: policyId }, { new: true })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "images",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "salesCompsId",
                model: "SalesComps",
            })
            .populate({
                path: "rentCompsId",
                model: "RentComps",
            })
            .populate({
                path: "rentEstimateId",
                model: "RentEstimateComps",
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "BRRRR",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Rental",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Flip",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "purchasePolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "profile",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    }
                }
            })
            .populate({
                path: "ownerProfile",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName wallet",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                }
            })

        res.json({
            status: 200,
            data: updatedProject,
        });

    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}


const getAllAdminProfileCriterias = async (req, res) => {
    try {
        const userProfileId = req.body.profileId
        let accessableOrgsAndAdminIds = await getAllAdminIdsHelper(userProfileId);
        let adminIds = accessableOrgsAndAdminIds.adminProfileIds;

        const adminProfileCriteria = await PurchasePolicy.find({
            profile: { $in: adminIds }
        })
            .populate({
                path: "Rental",
                model: "PurchaseCriteria",
            })
            .populate({
                path: "BRRRR",
                model: "PurchaseCriteria",
            })
            .populate({
                path: "Flip",
                model: "PurchaseCriteria",
            })
            .populate({
                path: "profile",
                model: "Profile",
                select: "parent parentModelName",
                populate: {
                    path: "parent",
                    select: "name displayName wallet",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                }
            })
            .sort({ createdAt: -1 })

        res.json({
            status: 200,
            data: adminProfileCriteria
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}


const updatePurchaseCriteria = async (req, res) => {
    try {
        const criteriaId = req.body.criteriaId
        const updateField = req.body.updateField

        const updatedCriteria = await PurchaseCriteria.findByIdAndUpdate(criteriaId, updateField, { new: true })

        res.json({
            status: 200,
            data: updatedCriteria,
        });

    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}

const createCompareReport = async (req, res) => {
    try {
        console.log(req.body)
        const newCompareReport = new ComparedReport(req.body);

        await newCompareReport.save()

        res.json({
            status: 200,
            data: newCompareReport,
        });

    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}

const getComparePopulate = async (req, res) => {
    try {
        console.log(req.body)
        const compareId = req.body.compareId;

        const getCompare = await ComparedReport.findById(compareId)
            .populate({
                path: "criteriaPolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Rental",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "criteriaPolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "BRRRR",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "criteriaPolicy",
                model: "PurchasePolicy",
                populate: {
                    path: "Flip",
                    model: "PurchaseCriteria",
                }
            })
            .populate({
                path: "reports",
                model: "Report",
                populate: {
                    path: "teamId",
                    model: "Team",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                        }
                    }
                }
            })

        res.json({
            status: 200,
            data: getCompare,
        });

    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}

const updateCompareReport = async (req, res) => {
    try {
        console.log(req.body);
        const updateObj = req.body
        const _id = req.body._id
        let updatedCompareReport = await ComparedReport.findByIdAndUpdate(_id, updateObj, { new: true })

        res.json({
            status: 200,
            data: updatedCompareReport,
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}

const getReportsCompares = async (req, res) => {
    try {
        const profileId = req.body.profileId

    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}



module.exports = {
    findOrCreateAndAddPolicy,
    updatePurchaseCriteria,
    getAllAdminProfileCriterias,
    createPurchasePolicy,
    createCompareReport,
    getComparePopulate,
    updateCompareReport
};