const mongoose = require("mongoose");

const {Schema, model} = mongoose;

const NotificationSchema = new Schema(
    {
        activity: {
            type: Schema.Types.ObjectId,
            ref: "Activity",
        },
        notificationProfiles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Profile",
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        seen: {
            type: Boolean,
            default: false,
        },
        seenAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const Notification = model("Notification", NotificationSchema);

module.exports = Notification;
