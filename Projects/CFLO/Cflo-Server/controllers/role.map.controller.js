const RoleMap = require('../models/role.map.model')
var _ = require('../helpers/array.utils');
const async =  require('async');

const getByIds = (req, res)=>{
    const roleMaps = req.body.roles;
    async.map(roleMaps, function(roleMapId, callback) {
        RoleMap.findById(roleMapId)
            .populate({ path :'profile',select:'parent parentModelName', populate :{
                path: 'parent',select:'name displayName wallet',populate:{
                    path:'displayPicture',model:'File',select:'url thumbUrl'
                }
            }})
            .then(roleMap => {
                callback(null, roleMap)
            })
            .catch(err => {
                callback(err)
            })

    }, function(err, results) {

        res.json({
            status: '200',
            result: results
        })
    })
}

const create = async (req,res)=>{
        
    try {

        var roleMap = new RoleMap(req.body)        
        roleMap = await roleMap.save()
        var roleId = roleMap._id;

        RoleMap.findById(roleId)
            .populate({ path :'profile',select:'parent parentModelName', populate :{
                path: 'parent',select:'name displayName wallet',populate:{
                    path:'displayPicture',model:'File',select:'url thumbUrl'
                }
            }})
            .then(role=>{
                res.json(role);
            })


    } catch (error) {
        res.send(error)
    }
}

const update = async (req, res)=>{
    var roleMapObject = req.body;
    var roleMapId = roleMapObject._id;

    return RoleMap.findByIdAndUpdate(roleMapId, roleMapObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
                var roleId = resp._id;

                RoleMap.findById(roleId)
                    .populate({ path :'profile',select:'parent parentModelName', populate :{
                        path: 'parent',select:'name displayName wallet',populate:{
                            path:'displayPicture',model:'File',select:'url thumbUrl'
                        }
                    }})
                    .then(role=>{
                        res.json(role);
                    })

            }

        })
}

module.exports = {
    create,
    update,
    getByIds
}