const CalendarEvent = require("../models/calendar.event.model");
const Issue = require("../models/issue.model");

const modelDict = {
    Issue,
};

const addInParent = async event => {
    let parentId = event.parent;
    const parentModelName = event.parentModelName;

    let parent = null;
    if (parentModelName == "Issue") {
        const eventId = event._id;
        const Parent = modelDict[parentModelName];
        parent = await Parent.updateOne({_id: parentId}, {$addToSet: {calendarEvents: eventId}});
    }

    return parent;
};

const removeFromParent = async event => {
    let parentId = event.parent;
    const parentModelName = event.parentModelName;

    let parent = null;
    if (parentModelName == "Issue") {
        const eventId = event._id;
        const Parent = modelDict[parentModelName];
        parent = await Parent.updateOne({_id: parentId}, {$pull: {calendarEvents: eventId}});
    }

    return parent;
};

const create = async (req, res) => {
    try {
        let event = new CalendarEvent(req.body);
        await event.save();
        let parent = await addInParent(event);

        res.status(200).json({
            data: {
                event,
                parent,
            },
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const update = async (req, res) => {
    try {
        const eventNew = req.body;
        let event = await CalendarEvent.findByIdAndUpdate(eventNew._id, eventNew, {new: true});
        res.status(200).json({
            data: event,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

const deleteEvent = async (req, res) => {
    try {
        const eventId = req.body.eventId;
        const event = await CalendarEvent.findById(eventId);

        await CalendarEvent.findByIdAndDelete(eventId);

        let parent = await removeFromParent(event);

        res.status(200).json({
            data: null,
        });
    } catch (error) {
        res.status(400).json({
            data: null,
            error: error,
        });
    }
};

module.exports = {
    create,
    update,
    deleteEvent,
};
