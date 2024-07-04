const ReportItem = require("../models/reportItem.model");
const Report = require("../models/report.model");
const _ = require("lodash");
const async = require("async");

const fetchItems = async (req, res) => {
    try {
        let reportId = req.body.reportId;
        let itemType = req.body.itemType;
        let docs = await Report.find({_id: reportId});
        if (docs) {
            // console.log(docs);
            res.json({
                status: 200,
                data: docs?.[itemType],
            });
        } else {
            console.log("error in retrieval");
        }
    } catch (error) {
        console.log(error);
    }
};

const createItem = async (req, res) => {
    let itemData = req.body.itemData;
    let itemType = req.body.itemType;
    let reportId = req.body.reportId;
    console.log(itemData);
    console.log(itemType);
    console.log(reportId);
    try {
        // let newItem = new ReportItem(itemData);
        // let item = await newItem.save();
        // if (item) {
        Report.findOneAndUpdate({_id: reportId}, {$push: {[itemType]: {...itemData}}}, {new: true}, (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Item Data Updated!");
                // console.log(docs);
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        });
        // }
    } catch (error) {
        console.log(error);
    }
};

const deleteItem = async (req, res) => {
    let reportId = req.body.reportId;
    let itemId = req.body.itemId;
    let ItemType = req.body.itemType;
    console.log(reportId);
    console.log(itemId);
    console.log(ItemType);
    try {
        Report.findOneAndUpdate({_id: reportId}, {$pull: {[ItemType]: {_id: itemId}}}, {new: true}, (err, docs) => {
            if (err) {
                console.log(err);
            } else {
                console.log(ItemType + " Object Deleted!");
                // console.log(docs);
                res.json({
                    status: 200,
                    data: docs,
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const updateItem = async (req, res) => {
    let data = req.body.itemData;
    let itemId = req.body.itemId;
    let itemType = req.body.itemType;

    let searchProperty = itemType + "._id";
    let setProperty = itemType + ".$";
    try {
        Report.findOneAndUpdate(
            {
                [searchProperty]: itemId,
            },
            {
                $set: {
                    [setProperty]: data,
                },
            },
            {new: true},
            (err, docs) => {
                if (err) {
                    console.log(err);
                } else {
                    // console.log(docs);
                    res.status(200).json({
                        data: docs,
                    });
                    console.log("Item Data Updated!");
                }
            }
        );
    } catch (error) {
        console.log(error);
    }
};

// const deleteItem = async (req, res) => {
//     try {
//         let id = req.body.id;
//         await ReportItem.deleteOne({_id: id});
//         console.log("deleted");
//         console.log("reportItem:" + id);
//     } catch (error) {
//         console.log(error);
//     }
// };
// const deleteItem = async (req, res) => {
//    try {
//     let id = req.body.id;
//         ReportItem.deleteOneAndDelete({ _id: userId }, { $pull: { [arrayName]: { _id: arrayObjId } } }, { new: true }, (err, docs) => {
//             if (err) {
//                 console.log(err);
//             } else {
//                 console.log(arrayName + " Object Deleted!");
//                 res.json({
//                     status: 200,
//                     data: docs,
//                 });
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

// const updateItem = async (req, res) => {
//     try {

//         await ReportItem.updateOne({_id: id}, {...data}, (error, docs) => {
//             if (error) {
//                 console.log(error);
//             } else {
//                 console.log("Updated!");
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// };

module.exports = {
    createItem,
    fetchItems,
    deleteItem,
    updateItem,
};
