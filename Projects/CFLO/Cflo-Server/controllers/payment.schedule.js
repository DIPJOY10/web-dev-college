const PaymentSchedule = require('../models/payment.schedule.model');
const PaymentMilestone = require('../models/payment.milestone.model');
var _ = require('../helpers/array.utils');
var async = require('async');

const create = (req, res) => {
    var paymentSchedule = new PaymentSchedule(req.body);
    paymentSchedule.save()
        .then(paymentSchedule => {
            res.json(paymentSchedule);
        })
}

const update = (req, res) => {
    var paymentScheduleObject = req.body;
    var paymentScheduleId = paymentScheduleObject._id;

    PaymentSchedule.findByIdAndUpdate(paymentScheduleId, paymentScheduleObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
                console.log(resp)
                res.json(resp);
            }

        })
}

const getDetail = (req, res) => {
    var scheduleId = req.body.scheduleId

    PaymentSchedule.findById(scheduleId)
        .populate('milestones')
        .then(paymentSchedule => {
            var milestones = paymentSchedule.milestones;
            paymentSchedule.milestones = milestones.map(milestone=>milestone._id)
            res.json({
                schedule:paymentSchedule,
                milestones
            })
        })
        .catch(err => {
            res.status(400).json(null)
        })
}



const createMilestone = (req, res) => {
    var paymentMilestone = new PaymentMilestone(req.body);
    var scheduleId = paymentMilestone.schedule;

    paymentMilestone.save()
        .then(paymentMilestone => {
            PaymentSchedule.findById(scheduleId)
                .then(schedule=>{
                    var milestoneId = paymentMilestone._id;
                    var milestoneOld = schedule.milestones?schedule.milestones:[];
                    schedule.milestones = _.union(milestoneOld,[milestoneId]);
                    schedule.save()
                        .then(schedule=>{
                            res.json({
                                schedule,
                                milestones:[paymentMilestone]
                            })
                        }) 
                })

        })
}

const updateMilestone = (req, res) => {
    var paymentMilestoneObject = req.body;
    var paymentMilestoneId = paymentMilestoneObject._id;

    PaymentMilestone.findByIdAndUpdate(paymentMilestoneId, paymentMilestoneObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
                console.log(resp)
                res.json(resp);
            }

        })
}



module.exports = {
    create,
    update,
    getDetail,
    createMilestone,
    updateMilestone
}