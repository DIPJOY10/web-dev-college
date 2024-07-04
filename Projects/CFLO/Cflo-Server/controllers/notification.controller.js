const Notification = require("../models/notification.model");
const mongoose = require("mongoose");

const createNotification = async notificationBody => {
    try {
        const notification = new Notification(notificationBody);
        // console.log(notification);
        notification.save();
    } catch (error) {
        console.log(error);
    }
};

const getNotifications = async (req, res) => {
    try {
        const profile = req.body.profile;
        const notifications = await Notification.find({
            notificationProfiles: {$in: [mongoose.Types.ObjectId(profile)]},
        })
            .populate({
                path: "activity",
                populate: [
                    {
                        path: "data",
                        populate: [
                            {
                                path: "userProfile",
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
                                path: "user",
                                select: "name displayName model",
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        ],
                    },
                    {
                        path: "user",
                        select: "name displayName wallet model",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    },
                    {
                        path: "parent",
                        populate: [
                            {
                                path: "profile",
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
                                path: "user",
                                select: "name displayName model",
                                populate: {
                                    path: "displayPicture",
                                    model: "File",
                                    select: "url thumbUrl",
                                },
                            },
                        ],
                    },
                    {
                        path: "profile",
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
                ],
            })
            .sort("-createdAt");

        res.status(200).json({
            notifications,
        });
    } catch (error) {
        res.status(400).json({
            notifications: null,
            error,
        });
    }
};

module.exports = {
    createNotification,
    getNotifications,
};
