const async = require('async');
const Term = require('../../models/wallet.term.model');
const Transaction = require("../../models/wallet.transaction.model");
const {update : updateTx} = require('./transaction.controller');

const create = async (req, res) => {
    try {
        var term = new Term(req.body.term);
        term = await term.save()
        const updateTerm = {
           term : term._id
        }
        console.log(term)
        res.json({
            status:200,
            data: term
        })
    } catch (error) {
        res.json({
            status:400,
            data: null,
            error
        })
    }
}


const update = (req, res) => {
    var termObject = req.body;
    var termId = termObject._id;
    Term.findByIdAndUpdate(termId, termObject, { new: true },
        function(err, resp) {
            if (err) {
                console.log(err)
            } else {
                
                res.json({
                    status: 200,
                    data: resp
                });
                
            }

        })
}

const getTerms = async (req, res) =>{
    var walletId = req.body.walletId;
    if(walletId){
        await Term.find({wallet: walletId})
        .exec(async (error, terms) =>{
           if(error) return res.json({ status: 400, data : null, error})
           if(terms){
            await Term.find({public: true})
            .exec((error, publicTerms)=>{
                if(error){
                    res.json({
                        status:400,
                        data:null,
                        error
                    })
                }else{
                    terms.map((term)=>{
                        publicTerms.push(term);
                    })
                    var resObject = {
                        status: 200,
                        data: publicTerms
                    }
                    res.json(resObject)
                }
            })
           }
        })
    }else{
        res.json({
            status:400,
            data:null,
        })
    }
}

const getPublicTerms = async (req, res) =>{

        var terms = await Term.find({public: true})
        .exec((error, terms)=>{
            if(error){
                res.json({
                    status:400,
                    data:null,
                    error
                })
            }else{
                var resObject = {
                    status: 200,
                    data: terms
                }
                res.json(resObject)
            }
        }) 
}


module.exports = {
    create,
    update,
    getTerms,
    getPublicTerms
}