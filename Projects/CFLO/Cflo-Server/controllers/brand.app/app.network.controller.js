const AppNetwork = require('../../models/brand.app.network.model')
const BrandApp = require('../../models/brand.app.model')
const RentalRequest = require('../../models/rental.request.model')
const RentalAppProject = require('../../models/rental.app.project.setting')
const async = require('async')
const RentalRelation = require('../../models/rental.relation.model')




const create = async (req,res)=>{
    try {
        const network = new AppNetwork(req.body)
        await network.save()

        res.status(200).json({
            data: network
        })

    } catch (error) {
        res.status(400).json({
            data: null,
            error
        }) 
    }
}


const matchPasscode = async (req,res)=>{

    try {

        const brandApp = req.body.brandApp;
        const passcode = req.body.passcode;

        const networks = await AppNetwork.find({
            brandApp,
            passcode
        })

        const network = networks[0]

    
        if(networks.length==0&&!network._id){
            res.status(400).json({
                data: null,
                error:'Network not found'
            })
        }else{

            const oldReqs = await RentalRequest.find({
                brandApp,
                brandAppNetwork:network._id,
                tenant:req.body.tenant
            })

            var rentalReq = oldReqs[0]
            if(oldReqs.length==0){
                rentalReq = new RentalRequest({
                    ...req.body,
                    brandAppNetwork: network._id         
                })

                await rentalReq.save()

            }



            res.json({
                status:200,
                data:{
                    rentalReq,
                    network
                }
            })


        }



    } catch (error) {
        console.log(error,' is the error')
        return {
            status:400,
            data: null,
            error
        } 
    }
}


const findOrCreate = async (req,res)=>{

    try {
        console.log(req.body)
        const profileId = req.body.profileId;
        const brandAppId = req.body.brandAppId 
        const netApps = await AppNetwork.find({
            brandApp:brandAppId,
            access:{ $in:profileId}
        })

        const networkIds = netApps.map(netapp=>netapp._id)
        const rentalReqs = await RentalRequest.find({ 
            brandApp: brandAppId, 
            status:'processing',
            brandAppNetwork : { $in: networkIds},

        })

        res.status(200).json({ data: {netApps, rentalReqs} });


    } catch (error) {

        return res.status(400).json({
            data: null,
            error
        })
    }

    // if app has no network for a team 
}

const getDetail = (req, res) => {
    try {

        const networkId = req.body.networkId

        async.parallel({
            network: function(callback) {
                AppNetwork.findById(networkId)
                    .then(network=>{
                        callback(null, network); 
                    })
            },
            rentalReqs:function(callback){
                RentalRequest.find({
                    brandAppNetwork:networkId,
                    status:'processing'
                })
                .populate({
                    path: 'team', select:'parent', populate:{
                        path:'parent', model:'Project', select:'displayName displayPicture',populate:{
                            path:'displayPicture',model:'File',select:'url thumbUrl'
                        }
                    }
                })
                .populate({
                    path:'tenant',populate:{ path:'parent',populate:{
                        path:'displayPicture',model:'File',select:'url thumbUrl'
                    }}
                })
                .populate({ path:'unit' , select:'name numTenants'})
                .then(rentalRels=>{
                    callback(null, rentalRels); 
                })   
            },
            rentalRelations: function(callback) {
                RentalRelation.find({
                        appNetwork: networkId
                    })
                    .populate({
                        path: 'team', select:'parent', populate:{
                            path:'parent', model:'Project', select:'displayName displayPicture',populate:{
                                path:'displayPicture',model:'File',select:'url thumbUrl'
                            }
                        }
                    })
                    .populate({
                        path:'tenant',populate:{ path:'parent',populate:{
                            path:'displayPicture',model:'File',select:'url thumbUrl'
                        }}
                    })
                    .populate({ path:'unit' , select:'name numTenants'})
                    .then(rentalRels=>{
                        callback(null, rentalRels); 
                    })
            }
        }, function(err, results) {


            
            res.json({
                status:200,
                data:results
            })
        });

    } catch (error) {
        return {
            status:400,
            data: null,
            error
        }    
    }
}   


const update = async (req, res) => {
    try {

        if(req.body&& req.body.appNetwork&&req.body.appNetwork._id){
            const appNetwork = req.body.appNetwork

            let network = await AppNetwork.findByIdAndUpdate(appNetwork._id, appNetwork, { new: true });
  
            if (!network) {
                res.json({ 
                    status:400,
                    data: null,
                    error:'Id not found '
                });
            } else {
              res.json({ status : 200 ,data: network });
            }
        }

    } catch(error) {
        res.json({
            status:400,
            data: null,
            error
        })   
    }
};



const getAllProjects =  async (req, res) => {

    try {

        const networkId = req.body.networkId

        const rentalProjects = await RentalAppProject.find({
            appNetwork: networkId
        })
        


        res.json({
            status: 200,
            data:rentalProjects
        })

    } catch (error) {
        return {
            status:400,
            data: null,
            error
        }    
    }

}



const addProject = async (req, res) => {


    try {

        const rentalAppProject = RentalAppProject(req.body)
        await rentalAppProject.save()
        res.json({
            status: 200,
            data:rentalAppProject
        })

    } catch (error) {
        return {
            status:400,
            data: null,
            error
        }    
    }

}

const removeProject =  async (req, res) => {

    try {

        var appNetwork = req.body.networkId
        var projectTeam = req.body.projectTeam
        const deleteRes = await RentalAppProject.deleteMany({
            appNetwork,
            projectTeam
        })

        res.json({
            status: 200,
            data:deleteRes
        })

    } catch (error) {
        return {
            status:400,
            data: null,
            error
        }    
    }

}

const getReqById = async (req, res) => {
        try {

        var reqId = req.body.reqId

        let rentalReq = await RentalRequest.findById(reqId)
            .populate('rentalRelation')

        let  rentalRelation;
        
        if(rentalReq.rentalRelation){
            rentalRelation = rentalReq.rentalRelation
            rentalReq.rentalRelation = rentalRelation._id
        }

        res.status(200).json({
            data: { rentalReq, rentalRelation }
        })

    } catch (error) {
        return {
            status:400,
            data: null,
            error
        }    
    }
}

const getRequests =   async (req, res) => {
    
    try {
    
        var networkIds = req.body.networkIds

        const rentalReqs = await RentalRequest.find({
                brandAppNetwork : { $in: networkIds},
                status:'processing'
            })
            .populate({
                path:'tenant',populate:{ path:'parent',populate:{
                    path:'displayPicture',model:'File',select:'url thumbUrl'
                }}
            }) 

        res.status(200).json({
            data: rentalReqs
        })

    } catch (error) {

        res.status(400).json({
            data: null,
            error
        })

    }
}

const updateReq = async (req, res) => {
    try {


        let rentalReq = await RentalRequest.findByIdAndUpdate(req.body._id, req.body, { new: true });

        res.json({ status : 200 ,data: rentalReq });

    } catch(error) {
        res.json({
            status:400,
            data: null,
            error
        })   
    }
};

const deleteReq = async (req, res) => {


    const reqId = req.body._id
    try {

        let rentalReq = await RentalRequest.findByIdAndDelete(reqId);

        res.json({ status : 200 ,data: rentalReq });

    } catch(error) {
        res.json({
            status:400,
            data: null,
            error
        })   
    }
};




module.exports = {
    create, 
    update,
    getDetail,
    matchPasscode,
    findOrCreate,
    addProject,
    getAllProjects,
    getReqById,
    removeProject,
    updateReq,
    deleteReq,
    getRequests,
}