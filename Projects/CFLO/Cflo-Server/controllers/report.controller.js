const Report = require("../models/report.model");
const _ = require("lodash");
const async = require("async");
const { CostExplorer } = require("aws-sdk");

const createReport = async (req, res) => {
    try {
        let report = new Report(req.body);
        let item = await report.save();
        res.status(200).json({
            data: report,
        });
        console.log("Created!");
        console.log(item._id);
    } catch (error) {
        console.log(error);
    }
};

const getReports = async (req, res) => {
    try {
        let teamId = req.body.teamId;
        let docs = await Report.find({ teamId: teamId });
        if (docs) {
            res.json({
                status: 200,
                data: docs,
            });
        } else {
            console.log("error in retrieval");
        }
    } catch (error) {
        console.log(error);
    }
};


const getReportsByObj = async (req, res) => {
    try {
        let findObj = req.body.query;
        const reports = await Report.find(findObj);

        res.json({
            status: 200,
            data: reports,
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


const getReportsByTeamIdsArr = async (req, res) => {
    try {
        let teamIdArr = req.body.teamIdArr;
        let reportTypes = req.body.reportTypes
        const reports = await Report.find({ teamId: { $in: teamIdArr }, reportType: reportTypes });

        res.json({
            status: 200,
            data: reports,
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


const getReport = async (req, res) => {
    try {
        let reportId = req.body.reportId;
        let reportData = await Report.findById(reportId)
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "displayPicture",
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    model: "parentModelName",
                    populate: {
                        path: "images",
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "salesCompsId",
                        model: "SalesComps",
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "rentCompsId",
                        model: "RentComps",
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "rentEstimateId",
                        model: "RentEstimateComps",
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
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
                        },
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Rental",
                            model: "PurchaseCriteria",
                        }
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "BRRRR",
                            model: "PurchaseCriteria",
                        }
                    }
                }
            })
            .populate({
                path: "teamId",
                model: "Team",
                populate: {
                    path: "parent",
                    populate: {
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Flip",
                            model: "PurchaseCriteria",
                        }
                    }
                }
            })


        const restructuredReport = {
            ...reportData._doc,
            teamId: reportData.teamId._id,
            teamData: reportData.teamId
        }


        if (restructuredReport) {
            res.status(200).json({
                data: restructuredReport,
            });
        } else {
            console.log("error");
        }
    } catch (error) {
        console.log(error);
    }
};

const deleteReport = async (req, res) => {
    try {
        let reportId = req.body.reportId;
        let teamId = req.body.teamId;
        await Report.deleteOne({ _id: reportId }, async (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                // console.log(docs);
                let arr = await Report.find({ teamId: teamId });
                res.status(200).json({
                    data: arr,
                });
            }
        });
        console.log("deleted");
        console.log("report:" + reportId);
        console.log("teamid:" + teamId);
    } catch (error) {
        console.log(error);
    }
};

// Report.findOneAndUpdate({ _id: reportId }, { $pull: { [arrayName]: { _id: arrayObjId } } }, { new: true }, (err, docs) => {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(arrayName + " Object Deleted!");
//         res.json({
//             status: 200,
//             data: docs,
//         });
//     }
// });

// const deleteReport = async (req, res) => {
//     try {
//         let reportId = req.body.reportId;
//         let teamId = req.body.teamId;
//         await Report.deleteOne({_id: reportId});
//         console.log("deleted");
//         console.log("report:" + reportId);
//         console.log("teamid:" + teamId);
//     } catch (error) {
//         console.log(error);
//     }
// };

const updateReport = async (req, res) => {
    try {
        let reportData = req.body.reportData;
        let reportId = req.body.reportId;
        let teamId = req.body.teamId;
        await Report.findOneAndUpdate({ _id: reportId }, { ...reportData }, { new: true }, (error, docs) => {
            if (error) {
                console.log(error);
            } else {
                // console.log("Updated: ");
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};


const updateReportById = async (req, res) => {
    try {
        let reportData = req.body.reportData;
        let rentalRelation = await Report.findByIdAndUpdate(reportData._id, reportData, { new: true })

        res.json({
            status: 200,
            data: rentalRelation,
        });

    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    createReport,
    getReports,
    getReportsByObj,
    getReport,
    deleteReport,
    updateReport,
    updateReportById,
    getReportsByTeamIdsArr
};
