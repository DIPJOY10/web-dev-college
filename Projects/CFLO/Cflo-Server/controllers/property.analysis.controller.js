const Report = require("../models/report.model");
const Project = require("../models/project.model");
const Profile = require("../models/profile.model");
const Team = require("../models/team.model");
const File = require("../models/file.model");
const _ = require("lodash");
const async = require("async");
const axios = require("axios");
const RentComps = require("../models/rentComps.model");
const SalesComps = require("../models/salesComps.model");
const RentEstimateComps = require("../models/rentEstimateComps.model");


const getPropertyDetailsHelper = async (zpid, projectId, category, propertyName) => {
    try {
        const options = {
            method: 'GET',
            url: 'https://zillow-com1.p.rapidapi.com/property',
            params: { zpid: zpid },
            headers: {
                'X-RapidAPI-Key': '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        };

        await axios.request(options)
            .then(async (response) => {
                const currentPropertyDetails = response.data
                let fileId = null

                console.log(currentPropertyDetails?.imgSrc)

                if (currentPropertyDetails?.imgSrc) {
                    const file = new File({
                        uploadStatus: "success",
                        fileUsage: "Image",
                        storage: "firebase",
                        url: currentPropertyDetails?.imgSrc,
                        thumbUrl: currentPropertyDetails?.imgSrc,
                    });

                    await file.save();
                    fileId = file._id
                }

                let updatedProject = {
                    propName: "",
                    category: category,
                    subCategory: "",
                    latitude: 0,
                    longitude: 0,
                    description: "",
                    propertyTaxRate: 0,
                    taxAnnualAmount: 0,
                    annualHomeownersInsurance: 0,
                    address: {
                        streetAddress: "",
                        zip: "",
                        city: "",
                        region: "",
                        country: ""
                    },
                    livingAreaUnits: "",
                    pricePerSquareFoot: "",
                    mls: 0,
                    bathroomsPartial: "",
                    bathroomsHalf: 0,
                    bathroomsFull: 0,
                    zestimate: 0,
                    rentZestimate: 0,
                    zpid: 0,
                    zestimateLowPercent: "",
                    zestimateHighPercent: "",
                    buyerAgencyCompensation: "",
                    parcelNumber: "",
                    stateId: 0,
                    countyId: 0,
                    lotSizeDimensions: "",
                    totalActualRent: 0,
                    price: 0,
                    homeStatus: ""
                }

                if (currentPropertyDetails?.homeStatus) {
                    updatedProject.homeStatus = currentPropertyDetails?.homeStatus
                }

                if (currentPropertyDetails?.yearBuilt) {
                    updatedProject.year = currentPropertyDetails?.yearBuilt
                } else if (currentPropertyDetails?.resoFacts?.yearBuilt) {
                    updatedProject.year = currentPropertyDetails?.resoFacts?.yearBuilt
                }

                if (currentPropertyDetails?.resoFacts?.buildingName) {
                    updatedProject.propName = currentPropertyDetails?.resoFacts?.buildingName
                } else {
                    updatedProject.propName = propertyName
                }

                if (currentPropertyDetails?.propertyTypeDimension) {
                    updatedProject.subCategory = currentPropertyDetails?.propertyTypeDimension
                } else {
                    updatedProject.subCategory = currentPropertyDetails?.homeType
                }

                if (currentPropertyDetails?.latitude) {
                    updatedProject.latitude = currentPropertyDetails?.latitude
                }

                if (currentPropertyDetails?.longitude) {
                    updatedProject.longitude = currentPropertyDetails?.longitude
                }

                if (currentPropertyDetails?.description) {
                    updatedProject.description = currentPropertyDetails?.description
                }

                if (currentPropertyDetails?.propertyTaxRate) {
                    updatedProject.propertyTaxRate = currentPropertyDetails?.propertyTaxRate
                }

                if (currentPropertyDetails?.resoFacts?.taxAnnualAmount) {
                    updatedProject.taxAnnualAmount = currentPropertyDetails?.resoFacts?.taxAnnualAmount
                }

                if (currentPropertyDetails?.annualHomeownersInsurance) {
                    updatedProject.annualHomeownersInsurance = currentPropertyDetails?.annualHomeownersInsurance
                }

                if (currentPropertyDetails?.livingAreaUnits) {
                    updatedProject.livingAreaUnits = currentPropertyDetails?.livingAreaUnits
                }

                if (currentPropertyDetails?.resoFacts?.pricePerSquareFoot) {
                    updatedProject.pricePerSquareFoot = currentPropertyDetails?.resoFacts?.pricePerSquareFoot
                }

                if (currentPropertyDetails?.resoFacts?.bathroomsPartial) {
                    updatedProject.bathroomsPartial = currentPropertyDetails?.resoFacts?.bathroomsPartial
                }

                if (currentPropertyDetails?.resoFacts?.bathroomsHalf) {
                    updatedProject.bathroomsHalf = currentPropertyDetails?.resoFacts?.bathroomsHalf
                }

                if (currentPropertyDetails?.mlsid) {
                    updatedProject.mls = currentPropertyDetails.mlsid
                }

                if (currentPropertyDetails?.resoFacts?.bathroomsFull) {
                    updatedProject.bathroomsFull = currentPropertyDetails?.resoFacts?.bathroomsFull
                }

                if (currentPropertyDetails?.zestimate) {
                    updatedProject.zestimate = currentPropertyDetails?.zestimate
                }

                if (currentPropertyDetails?.rentZestimate) {
                    updatedProject.rentZestimate = currentPropertyDetails?.rentZestimate
                }

                if (currentPropertyDetails?.zpid) {
                    updatedProject.zpid = currentPropertyDetails?.zpid
                }

                if (currentPropertyDetails?.zestimateLowPercent) {
                    updatedProject.zestimateLowPercent = currentPropertyDetails?.zestimateLowPercent
                }

                if (currentPropertyDetails?.zestimateHighPercent) {
                    updatedProject.zestimateHighPercent = currentPropertyDetails?.zestimateHighPercent
                }

                if (currentPropertyDetails?.resoFacts?.buyerAgencyCompensation) {
                    updatedProject.buyerAgencyCompensation = currentPropertyDetails?.resoFacts?.buyerAgencyCompensation
                }

                if (currentPropertyDetails?.resoFacts?.parcelNumber) {
                    updatedProject.parcelNumber = currentPropertyDetails?.resoFacts?.parcelNumber
                }

                if (currentPropertyDetails?.stateId) {
                    updatedProject.stateId = currentPropertyDetails?.stateId
                }

                if (currentPropertyDetails?.countyId) {
                    updatedProject.countyId = currentPropertyDetails?.countyId
                }

                if (currentPropertyDetails?.resoFacts?.lotSizeDimensions) {
                    updatedProject.lotSizeDimensions = currentPropertyDetails?.resoFacts?.lotSizeDimensions
                }

                if (currentPropertyDetails?.resoFacts?.totalActualRent) {
                    updatedProject.totalActualRent = currentPropertyDetails?.resoFacts?.totalActualRent
                }

                if (currentPropertyDetails?.price) {
                    updatedProject.price = currentPropertyDetails?.price
                }

                if (currentPropertyDetails?.address?.streetAddress) {
                    updatedProject.address.streetAddress = currentPropertyDetails?.address?.streetAddress
                }

                if (currentPropertyDetails?.address?.zipcode) {
                    updatedProject.address.zip = currentPropertyDetails?.address?.zipcode
                }

                if (currentPropertyDetails?.address?.city) {
                    updatedProject.address.city = currentPropertyDetails?.address?.city
                }

                if (currentPropertyDetails?.country) {
                    updatedProject.address.country = currentPropertyDetails?.country
                }

                if (currentPropertyDetails?.address?.state) {
                    updatedProject.address.region = currentPropertyDetails?.address?.state
                } else if (currentPropertyDetails?.address?.region) {
                    updatedProject.address.region = currentPropertyDetails?.address?.region
                }

                if (currentPropertyDetails?.bathrooms) {
                    updatedProject.bathNumbers = currentPropertyDetails?.bathrooms
                } else if (currentPropertyDetails?.resoFacts?.bathrooms) {
                    updatedProject.bathNumbers = currentPropertyDetails?.resoFacts?.bathrooms
                }

                if (currentPropertyDetails?.bedrooms) {
                    updatedProject.roomNumbers = currentPropertyDetails?.bedrooms
                } else if (currentPropertyDetails?.resoFacts?.bedrooms) {
                    updatedProject.roomNumbers = currentPropertyDetails?.resoFacts?.bedrooms
                }

                if (currentPropertyDetails?.resoFacts?.lotSize) {
                    updatedProject.lotSize = currentPropertyDetails?.resoFacts?.lotSize
                }

                updatedProject.salesCompsId = null
                updatedProject.rentCompsId = null
                updatedProject.rentEstimateId = null
                updatedProject.isImported = true

                // add files
                if (fileId) {
                    updatedProject.displayPicture = fileId;
                }

                // Tax History Data
                if (currentPropertyDetails?.taxHistory && currentPropertyDetails?.taxHistory.length > 0) {
                    const latestTaxHistory = {
                        time: currentPropertyDetails?.taxHistory[0]?.time,
                        taxPaid: currentPropertyDetails?.taxHistory[0]?.taxPaid,
                        value: currentPropertyDetails?.taxHistory[0]?.value
                    }
                    updatedProject.latestTaxHistory = latestTaxHistory
                }

                // livingArea data
                if (currentPropertyDetails?.livingAreaValue) {
                    updatedProject.area = currentPropertyDetails?.livingAreaValue
                } else if (currentPropertyDetails?.livingArea) {
                    updatedProject.area = currentPropertyDetails?.livingArea
                } else if (currentPropertyDetails?.resoFacts?.livingArea) {
                    const text = currentPropertyDetails?.resoFacts?.livingArea;
                    let withoutUnit = text.match(/\d+/g);
                    let str = withoutUnit + "";
                    let updatedStr = str.replaceAll(',', '')

                    if (updatedStr) {
                        updatedProject.area = updatedStr
                    }
                }

                //price history data
                if (currentPropertyDetails?.priceHistory && currentPropertyDetails?.priceHistory.length > 0) {
                    let priceHistoryArr = []

                    currentPropertyDetails?.priceHistory.map((unit) => {
                        priceHistoryArr.push({
                            date: unit?.date,
                            price: unit?.price
                        })
                    })
                    updatedProject.priceHistory = priceHistoryArr
                }

                // near by homes data
                if (currentPropertyDetails?.nearbyHomes && currentPropertyDetails?.nearbyHomes.length > 0) {
                    let nearbyHomesArr = []

                    currentPropertyDetails?.nearbyHomes.map((unit) => {
                        nearbyHomesArr.push({
                            zpid: unit?.zpid,
                            longitude: unit?.longitude,
                            price: unit?.price,
                            homeType: unit?.homeType,
                            latitude: unit?.latitude
                        })
                    })
                    updatedProject.nearbyHomes = nearbyHomesArr
                }

                const updatedSavedProject = await Project.findByIdAndUpdate(projectId, updatedProject, { new: true })
                    .populate({
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    })

                return updatedSavedProject;

            }).catch(function (error) {
                console.log(error)
                return null
            });
    } catch (err) {
        console.log(err);
        return null;
    }
}





const getPropertiesByAddress = async (req, res) => {
    try {
        const stAddress = req.body.streetAddress;
        const city = req.body.city;
        const state = req.body.state;
        const zipCode = req.body.zip;
        const type = req.body.type;
        const propertyTypeSelected = req.body.propertyTypeSelected
        const propertyName = req.body.propertyName
        const projectId = req.body.projectId;
        const addressStr = stAddress + ", " + city + ", " + state + " " + zipCode;

        const options = {
            method: 'GET',
            url: 'https://zillow-com1.p.rapidapi.com/propertyExtendedSearch',
            params: { location: addressStr, home_type: type },
            headers: {
                'X-RapidAPI-Key': '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
                'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
            }
        };

        await axios.request(options).then(async (response) => {
            const getData = response.data

            if (getData?.props && getData?.props.length > 0) {
                //get several Properties
                res.json({
                    status: 200,
                    data: {
                        type: "getSeveralProperties",
                        data: getData?.props
                    }
                });
            } else if (getData?.zpid) {
                //get exact Property
                console.log(getData?.zpid)

                const updatedProjectData = await getPropertyDetailsHelper(getData?.zpid, projectId, propertyTypeSelected, propertyName)
                res.json({
                    status: 200,
                    data: {
                        type: "getExactProperty",
                        data: null
                    }
                });

            } else if (getData.length > 0) {
                //get several zpids
                let zipId = null
                getData.map((data) => {
                    if (data?.zpid && !zipId) {
                        zipId = data?.zpid;
                    }
                })

                if (zipId) {
                    const updatedProjectData = await getPropertyDetailsHelper(zipId, projectId, propertyTypeSelected, propertyName)
                    res.json({
                        status: 200,
                        data: {
                            type: "getExactProperty",
                            data: null
                        }
                    });
                } else {
                    res.json({
                        status: 200,
                        data: {
                            type: "somethingWrong",
                            data: null
                        }
                    });
                }
            } else {
                res.json({
                    status: 200,
                    data: {
                        type: "somethingWrong",
                        data: null
                    }
                });
            }
        }).catch(function (error) {
            console.log(error);
            res.json({
                status: 400,
                data: {
                    type: "somethingWrong",
                    data: null
                },
                error,
            });
        });
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: {
                type: "somethingWrong",
                data: null
            },
            err,
        });
    }
};

const getPropertyByZpid = async (req, res) => {
    try {
        let zpid = req.body.zpid;
        const propertyTypeSelected = req.body.propertyTypeSelected
        const propertyName = req.body.propertyName
        const projectId = req.body.projectId;

        const updatedProjectData = await getPropertyDetailsHelper(zpid, projectId, propertyTypeSelected, propertyName)
        res.json({
            status: 200,
            data: {
                type: "getExactProperty",
                data: null
            }
        });

    } catch (err) {
        res.json({
            status: 400,
            data: {
                type: "somethingWrong",
                data: null
            },
            err
        });
    }
}

const afterSelectProperty = async (req, res) => {
    try {
        const projectId = req.body.projectId;
        const zpid = req.body.zpid;
        const propertyTypeSelected = req.body.propertyTypeSelected
        const propertyName = req.body.propertyName

        const updatedProjectData = await getPropertyDetailsHelper(zpid, projectId, propertyTypeSelected, propertyName);

        res.json({
            status: 200,
            data: {
                type: "getExactProperty",
                data: null
            }
        });

    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: {
                type: "somethingWrong",
                data: null
            },
            err,
        });
    }
}

const salesSimilarProperties = async (req, res) => {
    try {
        const zpid = req.body.zpid
        const projectId = req.body.projectId
        const localSalesComps = await SalesComps.findOne({ zpid: zpid })

        if (localSalesComps) {
            console.log("call 1")
            const updatedProject = await Project.findByIdAndUpdate(projectId, { salesCompsId: localSalesComps._id }, { new: true })
                .populate({
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                })
                .populate({
                    path: "images",
                    model: "File",
                    select: "url thumbUrl",
                })
                .populate({
                    path: "salesCompsId",
                    model: "SalesComps",
                })
                .populate({
                    path: "rentCompsId",
                    model: "RentComps",
                })
                .populate({
                    path: "rentEstimateId",
                    model: "RentEstimateComps",
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Rental",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "BRRRR",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Flip",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "ownerProfile",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    }
                })

            res.json({
                status: 200,
                data: updatedProject
            });
        } else {
            const options = {
                method: 'GET',
                url: 'https://zillow-com1.p.rapidapi.com/similarProperty',
                params: { zpid: zpid },
                headers: {
                    'X-RapidAPI-Key': '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
                    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
                }
            };
            await axios.request(options).then(async (response) => {
                let allcomps = response?.data
                let compsArr = []

                allcomps && allcomps.map((prop) => {
                    let imgArr = []

                    prop?.miniCardPhotos && prop?.miniCardPhotos.map((img) => {
                        imgArr.push({
                            url: img?.url
                        })
                    })

                    compsArr.push({
                        bathrooms: prop?.bathrooms,
                        bedrooms: prop?.bedrooms,
                        miniCardPhotos: imgArr,
                        zpid: prop?.zpid,
                        longitude: prop?.longitude,
                        latitude: prop?.latitude,
                        address: {
                            city: prop?.address?.city,
                            state: prop?.address?.state,
                            streetAddress: prop?.address?.streetAddress,
                            zipcode: prop?.address?.zipcode
                        },
                        livingArea: prop?.livingArea,
                        homeType: prop?.homeType,
                        price: prop?.price
                    })
                })

                var salesCompsObj = new SalesComps({
                    zpid: zpid,
                    salesComps: compsArr,
                });
                await salesCompsObj.save()

                const updatedProject = await Project.findByIdAndUpdate(projectId, { salesCompsId: salesCompsObj._id }, { new: true })
                    .populate({
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    })
                    .populate({
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    })
                    .populate({
                        path: "salesCompsId",
                        model: "SalesComps",
                    })
                    .populate({
                        path: "rentCompsId",
                        model: "RentComps",
                    })
                    .populate({
                        path: "rentEstimateId",
                        model: "RentEstimateComps",
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Rental",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "BRRRR",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Flip",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "ownerProfile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        }
                    })

                console.log("call 2")

                res.json({
                    status: 200,
                    data: updatedProject
                });

            }).catch(function (error) {
                console.error(error);
                res.json({
                    status: 400,
                    data: null,
                    error,
                });
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}


const rentSimilarProperties = async (req, res) => {
    try {
        const zpid = req.body.zpid
        const projectId = req.body.projectId
        const localRentComps = await RentComps.findOne({ zpid: zpid })

        if (localRentComps) {
            console.log("call 1")
            const updatedProject = await Project.findByIdAndUpdate(projectId, { rentCompsId: localRentComps._id }, { new: true })
                .populate({
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                })
                .populate({
                    path: "images",
                    model: "File",
                    select: "url thumbUrl",
                })
                .populate({
                    path: "salesCompsId",
                    model: "SalesComps",
                })
                .populate({
                    path: "rentCompsId",
                    model: "RentComps",
                })
                .populate({
                    path: "rentEstimateId",
                    model: "RentEstimateComps",
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Rental",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "BRRRR",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Flip",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "ownerProfile",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    }
                })

            res.json({
                status: 200,
                data: updatedProject
            });
        } else {
            const options = {
                method: 'GET',
                url: 'https://zillow-com1.p.rapidapi.com/similarForRent',
                params: { zpid: zpid },
                headers: {
                    'X-RapidAPI-Key': '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
                    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
                }
            };
            await axios.request(options).then(async (response) => {
                let allcomps = response?.data
                let compsArr = []

                allcomps && allcomps.map((prop) => {
                    let imgArr = []
                    prop?.miniCardPhotos && prop?.miniCardPhotos.map((img) => {
                        imgArr.push({
                            url: img?.url
                        })
                    })

                    compsArr.push({
                        bathrooms: prop?.bathrooms,
                        bedrooms: prop?.bedrooms,
                        miniCardPhotos: imgArr,
                        zpid: prop?.zpid,
                        longitude: prop?.longitude,
                        latitude: prop?.latitude,
                        address: {
                            city: prop?.address?.city,
                            state: prop?.address?.state,
                            streetAddress: prop?.address?.streetAddress,
                            zipcode: prop?.address?.zipcode
                        },
                        livingArea: prop?.livingArea,
                        homeType: prop?.homeType,
                        price: prop?.price
                    })
                })

                var rentCompsObj = new RentComps({
                    zpid: zpid,
                    rentComps: compsArr,
                });
                await rentCompsObj.save()

                const updatedProject = await Project.findByIdAndUpdate(projectId, { rentCompsId: rentCompsObj._id }, { new: true })
                    .populate({
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    })
                    .populate({
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    })
                    .populate({
                        path: "salesCompsId",
                        model: "SalesComps",
                    })
                    .populate({
                        path: "rentCompsId",
                        model: "RentComps",
                    })
                    .populate({
                        path: "rentEstimateId",
                        model: "RentEstimateComps",
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Rental",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "BRRRR",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Flip",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "ownerProfile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        }
                    })

                console.log("call 2")

                res.json({
                    status: 200,
                    data: updatedProject
                });

            }).catch(function (error) {
                console.error(error);
                res.json({
                    status: 400,
                    data: null,
                    error,
                });
            });

        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}


const getRentEstimate = async (req, res) => {
    try {
        const propertyType = req.body.propertyType
        const streetAddress = req.body.streetAddress
        const projectId = req.body.projectId
        const city = req.body.city
        let address = `${streetAddress}, ${city}`;
        let locPropertyType = "MultiFamily"

        if (propertyType === "Single Family" || propertyType === "SINGLE_FAMILY") {
            locPropertyType = "SingleFamily"
        } else if (propertyType === "Multi Family" || propertyType === "MULTI_FAMILY") {
            locPropertyType = "MultiFamily"
        } else if (propertyType === "Condo" || propertyType === "CONDO") {
            locPropertyType = "Condo"
        } else if (propertyType === "Townhouse" || propertyType === "TOWNHOUSE") {
            locPropertyType = "Townhouse"
        }

        const localRentEstimateComps = await RentEstimateComps.findOne({ propertyType: locPropertyType, address: address })

        if (localRentEstimateComps) {
            console.log("call 1")
            const updatedProject = await Project.findByIdAndUpdate(projectId, { rentEstimateId: localRentEstimateComps._id }, { new: true })
                .populate({
                    path: "displayPicture",
                    model: "File",
                    select: "url thumbUrl",
                })
                .populate({
                    path: "images",
                    model: "File",
                    select: "url thumbUrl",
                })
                .populate({
                    path: "salesCompsId",
                    model: "SalesComps",
                })
                .populate({
                    path: "rentCompsId",
                    model: "RentComps",
                })
                .populate({
                    path: "rentEstimateId",
                    model: "RentEstimateComps",
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Rental",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "BRRRR",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "purchasePolicy",
                    model: "PurchasePolicy",
                    populate: {
                        path: "Flip",
                        model: "PurchaseCriteria",
                    }
                })
                .populate({
                    path: "ownerProfile",
                    model: "Profile",
                    select: "parent parentModelName",
                    populate: {
                        path: "parent",
                        select: "name displayName wallet",
                        populate: {
                            path: "displayPicture",
                            model: "File",
                            select: "url thumbUrl",
                        },
                    }
                })
            res.json({
                status: 200,
                data: updatedProject
            });
        } else {
            const options = {
                method: 'GET',
                url: 'https://zillow-com1.p.rapidapi.com/rentEstimate',
                params: { propertyType: locPropertyType, address: address },
                headers: {
                    'X-RapidAPI-Key': '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
                    'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
                }
            };

            await axios.request(options).then(async (response) => {
                let compsData = response?.data

                const rentEstimateCompsObj = new RentEstimateComps({
                    propertyType: locPropertyType,
                    address: address,
                    rentEstimateComps: {
                        comparableRentals: compsData?.comparableRentals,
                        percentile_25: compsData?.percentile_25,
                        highRent: compsData?.highRent,
                        lowRent: compsData?.lowRent,
                        lat: compsData?.lat,
                        median: compsData?.median,
                        rent: compsData?.rent,
                        percentile_75: compsData?.percentile_75,
                        long: compsData?.long
                    }
                })

                await rentEstimateCompsObj.save()

                const updatedProject = await Project.findByIdAndUpdate(projectId, { rentEstimateId: rentEstimateCompsObj._id }, { new: true })
                    .populate({
                        path: "displayPicture",
                        model: "File",
                        select: "url thumbUrl",
                    })
                    .populate({
                        path: "images",
                        model: "File",
                        select: "url thumbUrl",
                    })
                    .populate({
                        path: "salesCompsId",
                        model: "SalesComps",
                    })
                    .populate({
                        path: "rentCompsId",
                        model: "RentComps",
                    })
                    .populate({
                        path: "rentEstimateId",
                        model: "RentEstimateComps",
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Rental",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "BRRRR",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "purchasePolicy",
                        model: "PurchasePolicy",
                        populate: {
                            path: "Flip",
                            model: "PurchaseCriteria",
                        }
                    })
                    .populate({
                        path: "ownerProfile",
                        model: "Profile",
                        select: "parent parentModelName",
                        populate: {
                            path: "parent",
                            select: "name displayName wallet",
                            populate: {
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            },
                        }
                    })

                console.log("call 2")

                res.json({
                    status: 200,
                    data: updatedProject
                });

            }).catch(function (error) {
                console.error(error);
                res.json({
                    status: 400,
                    data: null,
                    error,
                });
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}


const getPropertyImgs = async (req, res) => {
    try {
        let zpid = req.body.zpid;
        let projectId = req.body.projectId;

        const projectData = await Project.findById(projectId)
            .populate({
                path: "displayPicture",
                model: "File",
                select: "url thumbUrl",
            })
            .populate({
                path: "images",
                model: "File",
                select: "url thumbUrl",
            })

        if (projectData) {
            if (projectData?.images && projectData?.images.length > 0) {
                console.log("DB Call")
                res.json({
                    status: 200,
                    data: projectData
                });
            } else {
                const options = {
                    method: 'GET',
                    url: 'https://zillow-com1.p.rapidapi.com/images',
                    params: { zpid: zpid },
                    headers: {
                        'X-RapidAPI-Key': '3e70cdbc73msh99ab2af355fd210p1a221ejsn7786ca803cad',
                        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
                    }
                };
                await axios.request(options).then(async (response) => {
                    const fullData = response?.data?.images
                    if (fullData && fullData.length > 0) {
                        let fileObjArr = [];
                        let fileIdsArr = [];

                        fullData && fullData.map((im) => {
                            const fileObj = new File({
                                uploadStatus: "success",
                                fileUsage: "Image",
                                storage: "firebase",
                                url: im,
                                thumbUrl: im,
                                parent: projectId,
                                parentModelName: "Project",
                            });

                            fileObjArr.push(fileObj)
                            fileIdsArr.push(fileObj?._id)
                        })
                        await File.insertMany(fileObjArr);

                        const updatedProject = await Project.findByIdAndUpdate(projectId, { images: fileIdsArr }, { new: true })
                            .populate({
                                path: "displayPicture",
                                model: "File",
                                select: "url thumbUrl",
                            })
                            .populate({
                                path: "images",
                                model: "File",
                                select: "url thumbUrl",
                            })
                            .populate({
                                path: "salesCompsId",
                                model: "SalesComps",
                            })
                            .populate({
                                path: "rentCompsId",
                                model: "RentComps",
                            })
                            .populate({
                                path: "rentEstimateId",
                                model: "RentEstimateComps",
                            })
                            .populate({
                                path: "purchasePolicy",
                                model: "PurchasePolicy",
                                populate: {
                                    path: "Rental",
                                    model: "PurchaseCriteria",
                                }
                            })
                            .populate({
                                path: "purchasePolicy",
                                model: "PurchasePolicy",
                                populate: {
                                    path: "BRRRR",
                                    model: "PurchaseCriteria",
                                }
                            })
                            .populate({
                                path: "purchasePolicy",
                                model: "PurchasePolicy",
                                populate: {
                                    path: "Flip",
                                    model: "PurchaseCriteria",
                                }
                            })
                            .populate({
                                path: "ownerProfile",
                                model: "Profile",
                                select: "parent parentModelName",
                                populate: {
                                    path: "parent",
                                    select: "name displayName wallet",
                                    populate: {
                                        path: "displayPicture",
                                        model: "File",
                                        select: "url thumbUrl",
                                    },
                                }
                            })

                        res.json({
                            status: 200,
                            data: updatedProject
                        });
                    } else {
                        res.json({
                            status: 400,
                            data: null,
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                    res.json({
                        status: 400,
                        data: null,
                        error,
                    });
                });
            }
        } else {
            res.json({
                status: 400,
                data: null,
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 400,
            data: null,
            err,
        });
    }
}








module.exports = {
    getPropertiesByAddress,
    afterSelectProperty,
    salesSimilarProperties,
    rentSimilarProperties,
    getRentEstimate,
    getPropertyByZpid,
    getPropertyImgs
}



