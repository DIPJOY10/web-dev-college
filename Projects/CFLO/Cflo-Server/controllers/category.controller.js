const Category = require("../models/category.model")
const _ = require("lodash");

const ObjectId = require("mongoose").Types.ObjectId;

const createMany = async (req, res) => {
    try {
        const names = req.body.names;
        if (names && names.length > 0) {

            const catsOld = await Category.find({
                name: { $in: names }
            })
            const catOldNamesAll = catsOld.map(cat => cat.name)
            const catOldNames = catOldNamesAll.map(cat => cat.toLowerCase())
            const newCatsToCreate = []

            names.map(name => {
                if (!catOldNames.includes(name.toLowerCase())) {
                    newCatsToCreate.push(name)
                }
            })

            if (newCatsToCreate.length > 0) {

                const newCatArr = newCatsToCreate.map(name => {
                    return {
                        name
                    }
                })
                const newCats = await Category.insertMany(newCatArr);
                res.status(200).json({
                    data: [...newCats, ...catsOld]
                })

            } else {
                res.status(200).json({
                    data: catsOld
                });
            }


        } else {
            res.status(200).json({
                data: [],
            });
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const update = async (req, res) => {
    try {
        if (req.body && req.body.category && req.body.category._id) {
            const catNew = req.body.category;

            let category = await Category.findByIdAndUpdate(catNew._id, rentalUnitNew, { new: true });

            if (!category) {
                res.status(400).json({
                    data: null,
                    error: "Id not found ",
                });
            } else {
                res.status(200).json({
                    data: category
                });
            }
        }
    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const getCats = async (req, res) => {

    var name = new RegExp(req.body.name, "ig");

    try {
        const cats = await Category.find({
            name
        });

        res.status(200).json({
            data: cats,
        });

    } catch (error) {
        res.status(400).json({
            data: null,
            error,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body)

        await newCategory.save()

        res.status(200).json({
            data: newCategory,
        });

    } catch (err) {
        res.status(400).json({
            data: null,
            err,
        });
    }
}

module.exports = {
    createMany,
    update,
    getCats,
    createCategory
};
