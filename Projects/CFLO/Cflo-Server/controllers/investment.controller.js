const Investment = require('../models/investment.model');
const Team = require('../models/team.model')
const RoleMap = require('../models/role.map.model')
const PSchedule = require("../models/payment.schedule.model")
var _ = require('../helpers/array.utils');
const Save = require('../models/save.model');



const getInvestmentDetail = (req, res) => {
    var investmentId = req.body.investmentId
    Investment.findById(investmentId)
        .populate({
            path: 'user', select: 'name displayName wallet model', populate: {
                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
            }
        })
        .populate({
            path: 'profile', select: 'parent parentModelName', populate: {
                path: 'parent', select: 'name displayName wallet', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'owner', select: 'parent parentModelName', populate: {
                path: 'user', select: 'name displayName wallet model', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate('files')
        .populate('user')
        .populate({
            path: 'roles', populate: {
                path: 'profile', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            }
        })
        .then(investment => {
            res.json(investment)
        })
}

const getTeamInvestments = (req, res) => {

    var teamId = req.body.team;

    Investment.find({ teams: { "$in": [teamId] } })
        .populate({
            path: 'user', select: 'name displayName wallet model', populate: {
                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
            }
        })
        .populate('files')
        .sort({ 'createdAt': -1 })
        .then(investments => {
            res.json(investments)
        })
}

const create = async (req, res) => {
    var investment = new Investment(req.body);
    var pSchedule = new PSchedule({
        parent: investment._id,
        parentModelName: 'Investment'
    })
    investment.schedule = pSchedule._id
    investment = await investment.save()
    await pSchedule.save()
    investment = await Investment.findById(investment?._id)
        // .populate({
        //     path: 'owner', select: 'name displayName wallet model', populate: {
        //         path: 'displayPicture', model: 'File', select: 'url thumbUrl'
        //     }
        // })
        .populate({
            path: 'user', select: 'name displayName wallet model', populate: {
                path: 'displayPicture', model: 'File', select: 'url thumbUrl'
            }
        })
        .populate({
            path: 'owner', select: 'parent parentModelName', populate: {
                path: 'parent', select: 'name displayName wallet', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'subject', select: 'parent parentModelName', populate: {
                path: 'parent', select: 'name displayName wallet', populate: {
                    path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                }
            }
        })
        .populate({
            path: 'roles',
            populate: {
                path: 'profile', select: 'parent parentModelName', populate: {
                    path: 'parent', select: 'name displayName wallet', populate: {
                        path: 'displayPicture', model: 'File', select: 'url thumbUrl'
                    }
                }
            }
        })
        .populate({
            path: 'schedule', populate: {
                path: "milestones"
            }, populate: {
                path: "parent"
            }
        })
    res.json(investment);

}


const update = (req, res) => {
    var investmentObject = req.body;
    var investmentId = investmentObject._id;

    if (
        investmentObject.location &&
        investmentObject.location.location &&
        investmentObject.location.location.coordinates.length > 0) {

        console.log(JSON.stringify(investmentObject.location), ' is the investment object')

    } else {

        delete investmentObject.location
    }



    Investment.findByIdAndUpdate(investmentId, investmentObject, { new: true },
        function (err, resp) {
            if (err) {
                console.log(err)
            } else {

                res.json(resp);
            }

        })
}
const getSavedInvestments = async (req, res) => {
    const profileId = req.body.profile;
    const userId = req.body.user;
    Save.find({ profile: profileId, user: userId, parentModelName: "Investment" }).then((investments) => {

        res.json(investments);
        // console.log(jobs, "savedJobs")
    })
}

module.exports = {
    getTeamInvestments,
    create,
    update,
    getInvestmentDetail,
    getSavedInvestments
}