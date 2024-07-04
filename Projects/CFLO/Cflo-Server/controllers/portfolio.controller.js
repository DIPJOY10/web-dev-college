var async = require("async");
const _ = require("lodash");
const moment = require("moment");
const Team = require("../models/team.model");
const keys = require("../keys/keys");
const Wallet = require("../models/wallet.model");
const Project = require("../models/project.model");
const Portfolio = require("../models/portfolio.model");
const AccessRole = require("../models/access.role.model");
const File = require("../models/file.model");

var imagePath = "https://cdn-icons-png.flaticon.com/512/2720/2720550.png";

const createPortfolio = async (req, res) => {
    try {
        let fileId;

        if (req.body.displayPicture) {
            fileId = req.body.displayPicture;
        } else {
            const file = new File({
                uploadStatus: "success",
                fileUsage: "Image",
                storage: "firebase",
                url: imagePath,
                thumbUrl: imagePath,
            });

            await file.save();
            fileId = file._id;
        }

        const participantsRole = req.body.accessableUserIdRole;

        let accessRoleObjArr = [];
        let accessRoleIdArr = [];

        const newPortfolio = new Portfolio({
            name: req.body.name,
            access: req.body.accessableUserId,
            projects: req.body.projectsAddedInfo,
            displayPicture: fileId,
            createdBy: req.body.user,
        });

        participantsRole.length > 0 &&
            participantsRole.map(userRole => {
                const accessRoleObj = new AccessRole({
                    user: userRole.user._id,
                    role: userRole.role,
                    parent: newPortfolio._id,
                    parentModelName: "Portfolio",
                    creator: req.body.user,
                });
                accessRoleIdArr.push(accessRoleObj._id);
                accessRoleObjArr.push(accessRoleObj);
            });

        newPortfolio.accessWithRole = accessRoleIdArr;

        const accessRoleRes = await AccessRole.insertMany(accessRoleObjArr);

        await newPortfolio.save().then(async portfolio => {
            Portfolio.findById(portfolio._id)
                .populate({
                    path: "access",
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
                })
                .populate({
                    path: "projects",
                    populate: [
                        {
                            path: "projectProfile",
                            model: "Profile",
                            select: "parent parentModelName",
                            populate: {
                                path: "parent",
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        },
                        {
                            path: "addedBy",
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
                        },
                        {
                            path: "project",
                            model: "Project",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    ],
                })

                .populate({
                    path: "accessWithRole",
                    model: "AccessRole",
                    populate: {
                        path: "user",
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
                    },
                })
                .populate({
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                })
                // .populate({
                //     path: "projects",
                //     populate: {
                //         path: "addedBy",
                //         model: "Profile",
                //         select: "parent parentModelName",
                //         populate: {
                //             path: "parent",
                //             select: "name displayName wallet",
                //             populate: {
                //                 path: "displayPicture",
                //                 model: "File",
                //                 select: "url thumbUrl",
                //             },
                //         },
                //     },
                // })
                .then(populatedPortfolio => {
                    res.json({
                        status: 200,
                        data: populatedPortfolio,
                    });
                });
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const updatePortfolio = async (req, res) => {
    try {
        var portfolioObject = req.body;
        var portfolioId = portfolioObject._id;

        const updatedPortfolio = await Portfolio.findByIdAndUpdate(portfolioId, portfolioObject, {new: true})
            .populate({
                path: "access",
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
            })
            .populate({
                path: "projects",
                populate: {
                    path: "project",
                    model: "Profile",
                    select: "parent parentModelName",
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
                path: "projects",
                populate: {
                    path: "addedBy",
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
                },
            })
            .populate({
                path: "accessWithRole",
                model: "AccessRole",
                populate: {
                    path: "user",
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
                },
            })
            .populate("displayPicture");
        res.json({
            status: 200,
            data: updatedPortfolio,
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const findPortfolioByProfile = async (req, res) => {
    try {
        let profileId = req.body.profileId;
        const accessablePortfolio = await Portfolio.find({access: {$in: [profileId]}})
            .populate({
                path: "access",
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
            })
            .populate({
                path: "projects",
                populate: [
                    {
                        path: "projectProfile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                    {
                        path: "addedBy",
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
                    },
                    {
                        path: "project",
                        model: "Project",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })

            .populate({
                path: "accessWithRole",
                model: "AccessRole",
                populate: {
                    path: "user",
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
                },
            })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            });
        // .populate({
        //     path: "access",
        //     model: "Profile",
        //     select: "parent parentModelName",
        //     populate: {
        //         path: "parent",
        //         select: "name displayName wallet",
        //         populate: {
        //             path: "displayPicture",
        //             model: "File",
        //             select: "url thumbUrl",
        //         },
        //     },
        // })
        // .populate({
        //     path: "projects",
        //     populate: {
        //         path: "project",
        //         model: "Profile",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        // })
        // .populate({
        //     path: "projects",
        //     populate: {
        //         path: "addedBy",
        //         model: "Profile",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             select: "name displayName wallet",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        // })
        // .populate({
        //     path: "accessWithRole",
        //     model: "AccessRole",
        //     populate: {
        //         path: "user",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             select: "name displayName wallet",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        // })
        // .populate("displayPicture");

        if (accessablePortfolio) {
            res.json({
                status: 200,
                data: accessablePortfolio,
            });
        }
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const getPortfolioById = async (req, res) => {
    try {
        const portfolioId = req.body.portfolioId;

        const resData = await Portfolio.findById(portfolioId)
            .populate({
                path: "access",
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
            })
            .populate({
                path: "projects",
                populate: [
                    {
                        path: "projectProfile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        },
                    },
                    {
                        path: "addedBy",
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
                    },
                    {
                        path: "project",
                        model: "Project",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                ],
            })

            .populate({
                path: "accessWithRole",
                model: "AccessRole",
                populate: {
                    path: "user",
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
                },
            })
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            });
        // .populate({
        //     path: "access",
        //     model: "Profile",
        //     select: "parent parentModelName",
        //     populate: {
        //         path: "parent",
        //         select: "name displayName wallet",
        //         populate: {
        //             path: "displayPicture",
        //             model: "File",
        //             select: "url thumbUrl",
        //         },
        //     },
        // })
        // .populate({
        //     path: "projects",
        //     populate: [
        //         {
        //             path: "projectProfile",
        //             model: "Profile",
        //             select: "parent parentModelName",
        //             populate: {
        //                 path: "parent",
        //                 populate: {
        //                     path: "displayPicture",
        //                     model: "File",
        //                     select: "url thumbUrl",
        //                 },
        //             },
        //         },
        //         {
        //             path: "addedBy",
        //             model: "Profile",
        //             select: "parent parentModelName",
        //             populate: {
        //                 path: "parent",
        //                 select: "name displayName wallet",
        //                 populate: {
        //                     path: "displayPicture",
        //                     model: "File",
        //                     select: "url thumbUrl",
        //                 },
        //             },
        //         },
        //         {
        //             path: "project",
        //             model: "Project",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     ],
        // })
        // .populate({
        //     path: "access",
        //     model: "Profile",
        //     select: "parent parentModelName",
        //     populate: {
        //         path: "parent",
        //         select: "name displayName wallet",
        //         populate: {
        //             path: "displayPicture",
        //             model: "File",
        //             select: "url thumbUrl",
        //         },
        //     },
        // })
        // .populate({
        //     path: "projects",
        //     populate: {
        //         path: "project",
        //         model: "Profile",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        // })
        // .populate({
        //     path: "projects",
        //     populate: {
        //         path: "addedBy",
        //         model: "Profile",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             select: "name displayName wallet",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        // })
        // .populate({
        //     path: "projects",
        //     populate: {
        //         path: "displayPicture",
        //         model: "File",
        //         select: "url thumbUrl",
        //     },
        // })
        // .populate({
        //     path: "accessWithRole",
        //     model: "AccessRole",
        //     populate: {
        //         path: "user",
        //         select: "parent parentModelName",
        //         populate: {
        //             path: "parent",
        //             select: "name displayName wallet",
        //             populate: {
        //                 path: "displayPicture",
        //                 model: "File",
        //                 select: "url thumbUrl",
        //             },
        //         },
        //     },
        // })
        // .populate("displayPicture");

        res.json({
            status: 200,
            data: resData,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const getRentRoll = async (req, res) => {
    try {
        const rentRoll = await Portfolio.aggregate([
            {
                $match: {},
            },
            {
                $unwind: "$projects",
            },
            {
                $lookup: {
                    from: "rentalunits",
                    localField: "projects.project",
                    foreignField: "project",
                    as: "units",
                },
            },
            // {$match: {$expr: {$ne: ["$units", []]}}},
            {
                $unwind: "$units",
            },
            //later change this join
            {
                $lookup: {
                    from: "rentalrelations",
                    localField: "units._id",
                    foreignField: "unit",
                    as: "relations",
                },
            },
            // {
            //     $addFields: {
            //         totalMonthlyBill: {
            //             $reduce: {
            //                 input: "$units.monthlyBill",
            //                 initialValue: 0,
            //                 in: {$add: ["$$value", "$$this.cost"]},
            //             },
            //         },
            //     },
            // },
        ]);

        res.status(200).json({
            data: rentRoll,
        });
    } catch (error) {
        res.status(400).json({
            message: "Something Went Wrong",
        });
    }
};

module.exports = {
    createPortfolio,
    updatePortfolio,
    findPortfolioByProfile,
    getPortfolioById,
    getRentRoll,
};
