const AccessRole = require("../models/access.role.model");
const _ = require("lodash");
const moment = require("moment");
const async = require("async");

const createAccessRole = async (req, res) => {
    try {
        const accessRoleObj = new AccessRole({
            user: req.body.user,
            role: req.body.role,
            parent: req.body.rentalId,
            parentModelName: "RentalRelation",
            creator: req.body.creator,
        });

        await accessRoleObj.save();

        res.json({
            status: 200,
            data: accessRoleObj,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const createManyAccessRole = async (req, res) => {
    try {
        const allAccessRole = req.body.allAccessRole;
        let accessRoleIds = [];
        let accessRoleObjs = [];

        allAccessRole.length > 0 &&
            allAccessRole.map(accessRole => {
                const accessRoleObj = new AccessRole({
                    user: accessRole.user,
                    role: accessRole.role,
                    parent: accessRole.parentId,
                    parentModelName: accessRole.parentModelName,
                    creator: accessRole.creator,
                });

                accessRoleObjs.push(accessRoleObj);
                accessRoleIds.push(accessRoleObj._id);
            });

        console.log(accessRoleObjs);

        const accessRoleRes = await AccessRole.insertMany(accessRoleObjs);

        res.json({
            status: 200,
            data: accessRoleIds,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const updateAccessRole = async (req, res) => {
    try {
        const accessRoleId = req.body._id;
        const accessRoleObj = req.body;

        let updatedAccessRole = await AccessRole.findByIdAndUpdate(accessRoleId, accessRoleObj, {new: true}).populate({
            path: "user",
            populate: {
                path: "parent",
                populate: {
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                },
            },
        });

        res.json({
            status: 200,
            data: updatedAccessRole,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

const updateManyAccessRoleWithRental = async (req, res) => {
    try {
        let accessRoleIds = req.body.accessRoleIds;
        let parentId = req.body.parentId;

        const updatedAccessRoles = await AccessRole.updateMany(
            {_id: {$in: accessRoleIds}},
            {$set: {parent: parentId}},
            {multi: true}
        );

        res.json({
            status: 200,
            data: updatedAccessRoles,
        });
    } catch (err) {
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
};

module.exports = {
    createAccessRole,
    updateAccessRole,
    updateManyAccessRoleWithRental,
    createManyAccessRole,
};
