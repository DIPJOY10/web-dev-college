const rePrimary = require("../helpers/property.type");
const RentalRelation = require("../models/rental.relation.model")

const getData = (req, res) => {
    res.json({
        status: 200,
        data: rePrimary,
    });
};

const createRelation = async (req, res) => {


    try {
        const oldRelations = await RentalRelation.find({
            unit: req.body.unit,
            tenant: req.body.tenant,
        })

        if(oldRelations.length > 0){
            
            res.status(200).json({
                data: oldRelations[0]
            })

        }else{

            const relation = new RentalRelation(req.body)
            await relation.save()
    
            res.status(200).json({
                data: relation
            })
        }


    } catch (error) {
        res.status(404).json({
            data:null,
            error:error
        })
    }
}

const getRelations = async (req, res) => {

    try {

        const relations = await RentalRelation.find({
            unit: req.body.unit,
        })
            .populate({
                path:'tenant',populate:{ path:'parent',populate:{
                    path:'displayPicture',model:'File',select:'url thumbUrl'
                }}
            })

        res.status(200).json({
            data: relations
        })

    } catch (error) {
        res.status(404).json({
            data:null,
            error:error
        })
    }
}

/**
 * Add Conversation to the rentalRelation
 */

const addConversation = async (req, res) => {

}



module.exports = {
    getData: getData,
    getRelations,
    createRelation: createRelation
};
