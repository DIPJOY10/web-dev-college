const RentalRelation = require("../../models/rental.relation.model");
const RentalUnit = require("../../models/rental.unit.model");
const Project = require("../../models/project.model");
const _ = require("lodash");
const RentalRequest = require("../../models/rental.request.model");
const Team = require("../../models/team.model");
const {initConvHelper} = require("../chat.controller");
const DocFolder = require("../../models/doc.folder.model");
const Profile = require("../../models/profile.model");
const moment = require("moment");
const async = require("async");
const AccessRole = require("../../models/access.role.model");
// const {createRentalPolicy} = require("./reatal.policy.controller");
const TxTemplate = require("../../models/wallet.transaction.template.model");
const {createTxTemplateFromObj} = require("../accounting/tx.template.controller");
const {createRentalPolicy} = require("./rental.policy.controller");

const assign = async (req, res) => {
    try {
        const reqId = req.body.reqId;

        let rentalReq = await RentalRequest.findById(reqId);

        const projectTeamId = req.body.projectTeamId;

        const unitId = req.body.unitId;

        let tenantId = rentalReq.tenant;

        const appNetwork = req.body.appNetwork;

        const team = await Team.findById(projectTeamId).populate("parent");
        const teamId = team._id;
        const profileId = team.parent.profile;
        const projectId = team.parent._id;

        const oldRels = await RentalRelation.find({
            team: projectTeamId,
            unit: unitId,
            tenant: tenantId,
        });

        let rentalRelation;

        if (oldRels.length > 0) {
            rentalRelation = oldRels[0];
        } else {
            let tenant = await Profile.findById(tenantId).populate("parent");

            let docFolder = new DocFolder({
                title: `${tenant.parent.displayName}`,
                description: `This folder contains ${tenant.parent.displayName}'s documents`,
                shared: [
                    {
                        profileId,
                    },
                ],
            });

            var folderProfile = new Profile({
                parent: docFolder._id,
                parentModelName: "DocFolder",
            });

            docFolder.profile = folderProfile._id;

            await folderProfile.save();

            await docFolder.save();

            rentalRelation = new RentalRelation({
                unit: unitId,
                tenant: tenantId,
                projectTeam: projectTeamId,
                project: projectId,

                shareTickets: [profileId],
                shareDocs: [folderProfile._id],
                chat: [profileId],

                appNetwork,
                rentalReq: reqId,
            });

            rentalRelation = await rentalRelation.save();
            // console.log("unit", rentalUnit);
            // const rentalUnitObj = await RentalUnit.findByIdAndUpdate(rentalRelation.unit, {
            //     rentalRelation: rentalRelation._id,
            // });
            // console.log("rentalUnit", rentalUnitObj);
        }

        const dateNow = new Date();

        rentalReq.rentalRelation = rentalRelation._id;
        rentalReq.status = "accepted";
        rentalReq.acceptOrReject = {
            time: dateNow,
        };

        await rentalReq.save();

        res.status(200).json({
            data: {
                rentalReq,
                rentalRelation,
            },
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const tempUpdateRentalRelation = async () => {
    const oldRels = await RentalRelation.find({})
        .populate({
            path: "projectTeam",
            populate: {
                path: "parent",
            },
        })
        .populate({
            path: "tenant",
            populate: {
                path: "parent",
            },
        });

    async.map(
        oldRels,
        async function (r, callback) {
            const tenant = r.tenant;
            const projectTeam = r.projectTeam;

            if (tenant && projectTeam) {
                const profileId = projectTeam.parent.profile;
                const projectId = projectTeam.parent._id;
                let docFolder = new DocFolder({
                    title: `${tenant.parent.displayName}`,
                    description: `This folder contains ${tenant.parent.displayName}'s documents`,
                    shared: [profileId],
                });

                var folderProfile = new Profile({
                    parent: docFolder._id,
                    parentModelName: "DocFolder",
                });

                docFolder.profile = folderProfile._id;

                r.shareDocs = [profileId];
                r.shareTickets = [profileId];

                r.project = projectId;
                r.tenant = tenant._id;
                r.projectTeam = projectTeam._id;

                await RentalRelation.findByIdAndUpdate(r._id, r);
            }
        },
        function (err, results) {}
    );
};

const initTenantConv = async (req, res) => {
    const convBody = req.body;
    const rentalRelId = convBody.rentalRelId;
    try {
        let rentalRel = await RentalRelation.findById(rentalRelId).populate({
            path: "conversation",
            populate: {
                path: "topMessage",
                populate: {
                    path: "files",
                },
            },
        });

        if (rentalRel.conversation) {
            const conversation = rentalRel.conversation;
            const message = conversation.topMessage;
            rentalRel.conversation = conversation._id;

            res.status(200).json({
                data: {
                    rentalRel,
                    conversation,
                    messages: [message],
                },
            });
        } else {
            const data = await initConvHelper(convBody);
            if (data && data.conversation) {
                let conv = data.conversation;
                rentalRel.conversation = conv._id;
                await rentalRel.save();
                res.status(200).json({
                    data: {...data, rentalRel},
                });
            } else {
                res.status(404).json({
                    data: null,
                    error: "Conversation not created",
                });
            }
        }
    } catch (error) {
        res.status(404).json({
            data: null,
            error: "Conversation not created",
        });
    }
};

const getRelationById = async (req, res) => {
    try {
        const relId = req.body.relId;

        const rentalRel = await RentalRelation.findById(relId)
            .populate({
                path: "projectTeam",
                select: "parent",
                populate: {
                    path: "parent",
                    model: "Project",
                    select: "displayName displayPicture",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "tenant",
                populate: {
                    path: "parent",
                },
            })
            .populate({
                path: "chat",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shareDocs",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "shareTickets",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "unit",
                select: "name numTenants team",
            })
            .populate({
                path: "tenantFullInfo",
                populate: {
                    path: "idProofDocs",
                    select: "title files",
                },
            })
            .populate({
                path: "chatWithRole",
                populate: {
                    path: "user",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            })
            .populate({
                path: "shareDocsWithRole",
                populate: {
                    path: "user",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            })
            .populate({
                path: "shareTicketsWithRole",
                populate: {
                    path: "user",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                },
            })
            .populate("project");

        res.json({
            status: 200,
            data: rentalRel,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getByProject = async (req, res) => {
    try {
        const teamId = req.body.projectTeamId;

        const rentalRels = await RentalRelation.find({projectTeam: teamId})
            .select("unit tenant tenantFullInfo")
            .populate({
                path: "tenant",
                populate: {
                    path: "parent",
                },
            })
            .populate({
                path: "unit",
                select: "name numTenants team",
            });

        const team = await Team.findById(teamId).populate({
            path: "parent",
            populate: {
                path: "profile",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            },
        });

        res.json({
            status: 200,
            data: {
                rentalRelations: rentalRels,
                team: team,
            },
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getByNetwork = async (req, res) => {
    try {
        const networkId = req.body.networkId;

        const rentalRels = await RentalRelation.find({
            appNetwork: networkId,
        })
            .populate({
                path: "team",
                select: "parent",
                populate: {
                    path: "parent",
                    model: "Project",
                    select: "displayName displayPicture",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                },
            })
            .populate({
                path: "tenant",
                select: "displayName displayPicture",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            })
            .populate({path: "unit", select: "name numTenants"});

        res.json({
            status: 200,
            data: rentalRels,
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const createFunction = forRentalRelation => async (req, res) => {
    try {
        const rentalRelation = new RentalRelation(req.body);

        const monthlyBillsReq = Array.isArray(req.body.monthlyBills) ? req.body.monthlyBills : [];
        const oneTimeBillsReq = Array.isArray(req.body.oneTimeBills) ? req.body.oneTimeBills : [];

        const monthlyBillsArr = await Promise.all(
            monthlyBillsReq.map(
                async el =>
                    await createTxTemplateFromObj({
                        ...(el || {}),
                        parent: rentalRelation?._id,
                        parentModelName: "RentalRelation",
                    })
            )
        );
        const oneTimeBillsArr = await Promise.all(
            oneTimeBillsReq.map(
                async el =>
                    await createTxTemplateFromObj({
                        ...(el || {}),
                        parent: rentalRelation?._id,
                        parentModelName: "RentalRelation",
                    })
            )
        );
        const rentalBill = await createTxTemplateFromObj({
            ...(req.body.rent || {}),
            parent: rentalRelation?._id,
            parentModelName: "RentalRelation",
        });
        const monthlyBillsIdArr = monthlyBillsArr.map(el => el?._id);
        const oneTimeBillsIdArr = oneTimeBillsArr.map(el => el?._id);

        rentalRelation.oneTimeBills = oneTimeBillsIdArr;
        rentalRelation.monthlyBills = monthlyBillsIdArr;
        rentalRelation.rent = rentalBill?._id;

        await rentalRelation.save();

        let rentalUnit;
        if (forRentalRelation) {
            console.log("unitId", rentalRelation?.unit);
            if (rentalRelation?.unit) {
                rentalUnit = await RentalUnit.findByIdAndUpdate(
                    rentalRelation?.unit,
                    {rentalRelation: rentalRelation?._id},
                    {new: true}
                );
            }
        }

        const newRentalRelation = await RentalRelation.findById(rentalRelation?._id)
            .populate("monthlyBills")
            .populate("rent")
            .populate("oneTimeBills");

        console.log(
            "monthlyBillAtt",
            monthlyBillsArr,
            "oneTimeBillAtt",
            oneTimeBillsArr,
            "reantalBill",
            rentalBill,
            "newRentalRelation",
            newRentalRelation,
            "rentalUnit",
            rentalUnit
        );

        res.json({
            status: 200,
            data: newRentalRelation,
        });
    } catch (error) {
        console.log(error);
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const create = createFunction(false);

const createRentalRelationforUnit = createFunction(true);

const update = async (req, res) => {
    try {
        console.log("get call");
        console.log(req.body);

        if (req.body && req.body.rentalRelation && req.body.rentalRelation._id) {
            const rentalRelationNew = req.body.rentalRelation;

            let rentalRelation = await RentalRelation.findByIdAndUpdate(rentalRelationNew._id, rentalRelationNew, {
                new: true,
            })
                .populate({
                    path: "projectTeam",
                    select: "parent",
                    populate: {
                        path: "parent",
                        model: "Project",
                        select: "displayName displayPicture",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "tenant",
                    populate: {
                        path: "parent",
                    },
                })
                .populate({
                    path: "chat",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "shareDocs",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "shareTickets",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                })
                .populate({
                    path: "unit",
                    select: "name numTenants team",
                })
                .populate({
                    path: "tenantFullInfo",
                    populate: {
                        path: "idProofDocs",
                        select: "title files",
                    },
                })
                .populate({
                    path: "chatWithRole",
                    populate: {
                        path: "user",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                })
                .populate({
                    path: "shareDocsWithRole",
                    populate: {
                        path: "user",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                })
                .populate({
                    path: "shareTicketsWithRole",
                    populate: {
                        path: "user",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                });

            if (!rentalRelation) {
                res.json({
                    status: 400,
                    data: null,
                    error: "Id not found ",
                });
            } else {
                res.json({
                    status: 200,
                    data: rentalRelation,
                });
            }
        } else {
            res.json({
                status: 400,
                data: null,
                error,
            });
        }
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const createRentalRelationWithUnits = async (req, res) => {
    try {
        console.log(req.body);
        const unitNum = parseInt(req.body.numUnits);
        let unitsArr = [];
        let rentalRelationArr = [];
        let accessRoleArr = [];

        const durationValue = req.body.durationValue;
        const intervalDays = parseInt(req.body.intervalDays);
        let nextDateMoment;

        switch (durationValue) {
            case "Monthly":
                nextDateMoment = moment(req.body.startDate).add(1, "months");
                break;
            case "Weekly":
                nextDateMoment = moment(req.body.startDate).add(1, "weeks");
                break;
            case "Other":
                nextDateMoment = moment(req.body.startDate).add(intervalDays, "days");
                break;
        }

        let msgWithArr = req.body.msgWithIdAndRole;
        let issuesShareWithArr = req.body.issuesShareWithIdAndRole;
        let docsShareWithArr = req.body.docShareWithIdAndRole;

        let numberOfUnits = parseInt(req.body.numRentalUnits);

        for (i = 0; i < unitNum; i++) {
            const unitName = "Rental Unit" + (numberOfUnits + i + 1) + "A";
            let index = numberOfUnits + i + 1;

            const unitObj = new RentalUnit({
                project: req.body.projectId,
                team: req.body.teamId,
                name: unitName,
                numTenants: index,
            });

            let msgWithRoleIdsArr = [];
            let docsShareRoleIdsArr = [];
            let issuesShareRoleIdsArr = [];

            msgWithArr.length > 0 &&
                msgWithArr.map(msgWith => {
                    const accessRoleObj = new AccessRole({
                        user: msgWith.user,
                        role: msgWith.role,
                        parentModelName: "RentalRelation",
                        creator: req.body.user,
                    });
                    msgWithRoleIdsArr.push(accessRoleObj._id);
                    accessRoleArr.push(accessRoleObj);
                });

            docsShareWithArr.length > 0 &&
                docsShareWithArr.map(docsWith => {
                    const accessRoleObj = new AccessRole({
                        user: docsWith.user,
                        role: docsWith.role,
                        parentModelName: "RentalRelation",
                        creator: req.body.user,
                    });
                    docsShareRoleIdsArr.push(accessRoleObj._id);
                    accessRoleArr.push(accessRoleObj);
                });

            issuesShareWithArr.length > 0 &&
                issuesShareWithArr.map(issuesWith => {
                    const accessRoleObj = new AccessRole({
                        user: issuesWith.user,
                        role: issuesWith.role,
                        parentModelName: "RentalRelation",
                        creator: req.body.user,
                    });
                    issuesShareRoleIdsArr.push(accessRoleObj._id);
                    accessRoleArr.push(accessRoleObj);
                });

            const rentalRelationObj = new RentalRelation({
                monthlyBills: req.body.monthlyBillsArr,
                oneTimeBills: req.body.oneTimeBillsArr,
                unit: unitObj._id,
                leaseStarted: req.body.leaseStartDate,
                leaseEnd: req.body.leaseEndDate,
                startDate: req.body.startDate,
                intervalType: durationValue,
                intervalDays: intervalDays,
                nextDate: nextDateMoment, //not
                wallet: req.body.walletId,
                project: req.body.projectId,
                projectTeam: req.body.teamId,
                shareTickets: req.body.issuesShareWith,
                shareTicketsWithRole: issuesShareRoleIdsArr, //
                shareDocs: req.body.docShareWith,
                shareDocsWithRole: docsShareRoleIdsArr, //
                chat: req.body.msgWith,
                chatWithRole: msgWithRoleIdsArr, //
            });

            // console.log("unitObj", unitObj);
            //UpdateNeeded: remove afterward
            unitObj.rentalRelation = rentalRelationObj._id;
            unitsArr.push(unitObj);
            rentalRelationArr.push(rentalRelationObj);
        }

        if (unitsArr.length > 0 && rentalRelationArr.length > 0) {
            const accessRoleRes = await AccessRole.insertMany(accessRoleArr);
            const unitsArrRes = await RentalUnit.insertMany(unitsArr);
            const rentalRelationArrRes = await RentalRelation.insertMany(rentalRelationArr);
            console.log(unitsArrRes);
            res.json({
                status: 200,
                data: {
                    unitsArr,
                    rentalRelationArr,
                    unitsArrRes,
                    rentalRelationArrRes,
                    accessRoleRes,
                },
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const addTenantWithRentalRelation = async (rentalRelationIds, tenantId) => {
    try {
        console.log(rentalRelationIds);
        console.log(tenantId);
        const updatedRental = await RentalRelation.updateMany(
            {_id: {$in: rentalRelationIds}},
            {$set: {tenant: tenantId, isTenantAdded: true}},
            {multi: true}
        );

        if (updatedRental) {
            return updatedRental;
        }
    } catch (err) {
        return null;
    }
};

const getAllUnitsForTenant = async (req, res) => {
    try {
        const projectIdCode = req.body.projectIdCode;
        const passCode = req.body.passCode;
        const tenantProfile = req.body.tenantProfile;

        const getProject = await Project.findOne({projectIdCode: projectIdCode});

        if (getProject) {
            let projectId = getProject._id;

            let rentalRelations = await RentalRelation.find({project: projectId, tenantPassword: passCode})
                .populate({
                    path: "unit",
                    select: "name numTenants team",
                })
                .populate({
                    path: "project",
                    model: "Project",
                    populate: {
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    },
                })
                .populate({
                    path: "tenant",
                    populate: {
                        path: "parent",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                });

            let rentalIds = [];
            rentalRelations.length > 0 &&
                rentalRelations.map(rental => {
                    if (!rental.isTenantAdded) {
                        rentalIds.push(rental._id);
                    }
                });

            if (rentalIds.length > 0) {
                await addTenantWithRentalRelation(rentalIds, tenantProfile);
            }

            res.json({
                status: 200,
                data: rentalRelations,
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

module.exports = {
    assign,
    initTenantConv,
    getRelationById,
    getByProject,
    getByNetwork,
    create,
    update,
    tempUpdateRentalRelation,
    createRentalRelationWithUnits,
    getAllUnitsForTenant,
    createRentalRelationforUnit,
};
