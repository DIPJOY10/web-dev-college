const RentalUnit = require("../../models/rental.unit.model");
const Project = require("../../models/project.model");
const _ = require("lodash");
const Team = require("../../models/team.model");
const RentalRelation = require("../../models/rental.relation.model");
const ObjectId = require("mongoose").Types.ObjectId;

const createMany = async (req, res) => {
    try {
        const units = req.body.units;
        if (units && units.length > 0) {
            const rentalUnits = await RentalUnit.insertMany(units);

            res.json({
                status: 200,
                data: rentalUnits,
            });
        } else {
            res.json({
                status: 200,
                data: [],
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

const update = async (req, res) => {
    try {
        if (req.body && req.body.rentalUnit && req.body.rentalUnit._id) {
            const rentalUnitNew = req.body.rentalUnit;

            let rentalUnit = await RentalUnit.findByIdAndUpdate(rentalUnitNew._id, rentalUnitNew, {new: true});

            if (!rentalUnit) {
                res.json({
                    status: 400,
                    data: null,
                    error: "Id not found ",
                });
            } else {
                res.json({
                    status: 200,
                    data: rentalUnit,
                });
            }
        }
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getUnits = async (req, res) => {
    const teamId = req.body.teamId;

    try {
        const units = await RentalUnit.find({
            team: teamId,
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
            data: {units, team},
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

const getUnitAndTenants = async (req, res) => {
    const teamId = req.body.teamId;

    try {
        if (ObjectId.isValid(teamId)) {
            const units = await RentalUnit.find({
                team: teamId,
            });

            const tenants = await RentalRelation.find({
                projectTeam: {$exists: true},
                projectTeam: teamId,
            });

            res.json({
                status: 200,
                data: {units, tenants},
            });
        } else {
            res.json({
                status: 200,
                data: {units: [], tenants: []},
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

const create = async (req, res) => {
    try {
        let rentalUnit = new RentalUnit(req.body);
        rentalUnit = await rentalUnit.save();
        res.json({
            status: 200,
            data: {rentalUnit},
        });
    } catch (error) {
        res.json({
            status: 400,
            data: null,
            error,
        });
    }
};

module.exports = {
    createMany,
    update,
    getUnits,
    getUnitAndTenants,
};
