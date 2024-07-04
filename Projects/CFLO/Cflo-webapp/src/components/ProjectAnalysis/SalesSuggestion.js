import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _, { keys } from "lodash";
import { useTheme } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import { getSimilerProperties, updateAnalysisReport } from "./api.call";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import { useMediaQuery } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import SortIcon from '@material-ui/icons/Sort';
import TrendingFlatIcon from '@material-ui/icons/TrendingFlat';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MyAutocomplete from "../styled/CommonComponents/MyAutoComplete"
import CircularProgress from '@material-ui/core/CircularProgress';
import TextFieldNumberFormated from "../styled/CommonComponents/TextFieldNumberFormated";
import Tooltip from '@material-ui/core/Tooltip';
import GoogleMapComponent from "../styled/CommonComponents/Google.Map";
import MyPopOver from "../styled/CommonComponents/MyPopOver";
import CustomBtn from "../styled/CommonComponents/CustomBtn";
const geodist = require('geodist')



const filterOptions = ["Similarity", "Distance", "Price", "Price/Sq.Ft."]

const useStyles = makeStyles((theme) => ({
    estimateAndMapCont: {
        width: "100%",
        display: "flex",
        borderRadius: "15px",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
        padding: "10px",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down('md')]: {
            flexDirection: "column"
        }
    },
    allEstimateCont: {
        width: "48%",
        display: "flex",
        flexDirection: "column",
        paddingLeft: "50px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            padding: "10px 50px"
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            padding: "10px 30px"
        },
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            padding: "0px"
        },
    },
    allEstimateContForView: {
        width: "48%",
        display: "flex",
        flexDirection: "column",
        paddingLeft: "50px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            padding: "10px 50px"
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            padding: "10px 30px"
        },
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            padding: "0px"
        },
    },
    estimateCont: {
        width: "220px",
        display: "flex",
        flexDirection: "column",
        "& h3": {
            color: "#3D3D3D",
            fontSize: "19px",
            marginLeft: "7px",
            marginBottom: "7px"
        },
        "& p": {
            color: theme.palette.primary.main,
            marginBottom: "7px",
            fontWeight: "500"
        },
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            "& h3": {
                marginTop: "15px"
            },
        }
    },
    zillowAndAveCont: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            alignItems: "flex-start",
        }
    },
    averageEstimateCont: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        marginTop: "15px",
        marginLeft: "7px"
    },
    lableStyle: {
        fontSize: "19px",
        fontWeight: "510",
        color: "#3D3D3D",
        marginBottom: "5px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "13px",
        }
    },
    lableValueStyle: {
        fontSize: "14px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
    },
    mapCont: {
        width: "48%",
        height: "330px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            marginTop: "40px"
        }
    },
    propertiesHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "40px",
        [theme.breakpoints.down('sm')]: {
            marginTop: "40px",
            marginBottom: "20px"
        }
    },
    sectionTitle: {
        fontSize: "22px",
        fontWeight: "510",
        margin: "60px 0px 15px 0px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "18px",
        }
    },
    priceCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& h2": {
            color: theme.palette.primary.main,
            fontWeight: "510",
            fontSize: "16px",
        },
        "& p": {
            color: "#263238",
            fontWeight: "500",
            fontSize: "12px",
        },
        [theme.breakpoints.down('sm')]: {
            alignItems: "flex-start",
        }
    },
    sortCont: {
        display: "flex",
        alignItems: "center",
    },
    otherPropertyCont: {
        display: "flex",
        padding: "1rem",
        margin: "20px 0px",
        borderRadius: "10px",
        justifyContent: "space-between",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down('sm')]: {
            margin: "12px 0px",
            padding: "1rem 0px",
        }
    },
    selectCont: {
        width: "70px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down('xs')]: {
            width: "50px",
        }
    },
    propertiesCont: {
        marginLeft: "20px",
        [theme.breakpoints.down('sm')]: {
            margin: "10px 0px",
        }
    },
    imgPropsAndPriceCont: {
        width: "calc(100% - 50px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            alignItems: "flex-start",
        }
    },
    imgAndPropsCont: {
        display: "flex",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column"
        }
    },
    progressCont: {
        width: "100%",
        height: "350px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputAndBtn: {
        width: "100%",
        display: "flex",
        alignItems: "flex-end",
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column",
            alignItems: "flex-start",
        }
    },
    marginBtn: {
        marginLeft: "10px",
        marginBottom: "2px",
        [theme.breakpoints.down('sm')]: {
            marginTop: "20px",
            marginLeft: "7px",
        }
    },
    selectableValue: {
        fontSize: "15px",
        fontWeight: "450",
        color: theme.palette.primary.main,
        marginTop: "5px",
        cursor: "pointer",
        padding: "3px 7px",
        '&:hover': {
            padding: "2px 6px",
            border: "1px solid #e9e9e9",
            backgroundColor: "#e9e9e9",
            borderRadius: "13px"
        }
    },
    selectableValueWithOutHover: {
        fontSize: "15px",
        fontWeight: "450",
        marginTop: "5px",
        padding: "3px 7px",
    },
    valueStyle: {
        display: "flex",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: "450",
        color: theme.palette.primary.main,
        "& p": {
            fontSize: "15px",
            fontWeight: "450",
        }
    },
    divider: {
        height: "100px",
        width: "1px",
        backgroundColor: "#B5B2B2",
        [theme.breakpoints.down('sm')]: {
            height: "0px",
        }
    },
    headName: {
        margin: "60px 0px 15px 0px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "& h3": {
            fontSize: "28px",
            color: "#00345D",
            fontWeight: "510",
        },
        [theme.breakpoints.down('xs')]: {
            "& h3": {
                fontSize: "17px",
            }
        }
    },
    filterCont: {
        padding: "7px",
        "& div": {
            padding: "5px 15px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "500"
        },
        [theme.breakpoints.down('sm')]: {
            padding: "4px",
            "& div": {
                padding: "5px 10px",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "500"
            },
        }
    },
}));

export default function SalesSuggestion(props) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const {
        projectData, zpid, setCurrentReport, reportId, viewOnly,
        currentReport, teamId, setSuggestionType, setProjectData
    } = props;
    const [saleProperties, setSaleProperties] = useState([]);
    const [similerProperties, setSimilerProperties] = useState([]);
    const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
    const [selectedFilterText, setSelectedFilterText] = useState("");
    const [averageSalesPriceSP, setAverageSalesPriceSP] = useState(0);
    const [averageSqFtPriceSP, setAverageSqFtPriceSP] = useState(0);
    const [lowestSalesPriceSP, setLowestSalesPriceSP] = useState(0);
    const [highestSalesPriceSP, setHighestSalesPriceSP] = useState(0);
    const [lowestSqFtPriceSP, setLowestSqFtPriceSP] = useState(0);
    const [highestSqFtPriceSP, setHighestSqFtPriceSP] = useState(0);
    const [averageSalesPriceZillow, setAverageSalesPriceZillow] = useState(0);
    const [averageSqFtPriceZillow, setAverageSqFtPriceZillow] = useState(0);
    const [lowestSalesPriceZillow, setLowestSalesPriceZillow] = useState(0);
    const [highestSalesPriceZillow, setHighestSalesPriceZillow] = useState(0);
    const [lowestSqFtPriceZillow, setLowestSqFtPriceZillow] = useState(0);
    const [highestSqFtPriceZillow, setHighestSqFtPriceZillow] = useState(0);
    const [priceBasedOnAveSqFt, setPriceBasedOnAveSqFt] = useState(0);

    const [arv, setArv] = useState(currentReport?.ARV || "");
    const [loadingBool, setLoadingBool] = useState(false);

    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const updateReport = async (data) => {
        const res = await updateAnalysisReport({
            reportData: data,
            reportId,
            teamId,
        })
            .then((data) => {
                setCurrentReport(data)
            })
            .catch((err) => {
                console.log(err)
            })
    };



    const calculateAllValues = (properties) => {
        let valueAverage = 0
        let perSqFtAverage = 0
        let valueTotal = 0
        let perSqFtTotal = 0
        let minimumPrice = 0
        let maximumPrice = 0
        let minimumSqFt = 0
        let maximumSqft = 0
        let len = 0
        properties && properties.length > 0 && properties.map((property, index) => {
            if (property?.selected) {
                let persqtValueForOthers = 0
                if (parseFloat(property?.livingArea) > 0 && parseFloat(property?.price) > 0) {
                    persqtValueForOthers = (parseFloat(property?.price) / parseFloat(property?.livingArea)).toFixed()
                }
                if (parseFloat(property?.price) > maximumPrice) {
                    maximumPrice = parseFloat(property.price);
                }
                if (parseFloat(property?.price) < minimumPrice || minimumPrice === 0) {
                    minimumPrice = parseFloat(property.price);
                }
                if (parseFloat(persqtValueForOthers) > maximumSqft) {
                    maximumSqft = parseFloat(persqtValueForOthers);
                }
                if (parseFloat(persqtValueForOthers) < minimumSqFt || minimumSqFt === 0) {
                    minimumSqFt = parseFloat(persqtValueForOthers);
                }
                valueTotal = valueTotal + parseFloat(property?.price)
                perSqFtTotal = perSqFtTotal + parseFloat(persqtValueForOthers)
                len = len + 1;
            }
        })
        valueAverage = valueTotal / len
        perSqFtAverage = perSqFtTotal / len
        setAverageSalesPriceSP(valueAverage)
        setAverageSqFtPriceSP(perSqFtAverage)
        setLowestSalesPriceSP(minimumPrice);
        setHighestSalesPriceSP(maximumPrice);
        setLowestSqFtPriceSP(minimumSqFt);
        setHighestSqFtPriceSP(maximumSqft)
        let mainPropertyPrice = parseFloat(projectData?.zestimate) || 0
        let livingArea = parseFloat(projectData?.area) || 1
        let zestimatedSqFt = mainPropertyPrice / livingArea
        let heightPercent = parseFloat(projectData?.zestimateHighPercent)
        let lowestPercent = parseFloat(projectData?.zestimateLowPercent)
        let heighestPrice = mainPropertyPrice + mainPropertyPrice * (heightPercent / 100);
        let lowestPrice = mainPropertyPrice - mainPropertyPrice * (lowestPercent / 100);
        let highestSqFtZillow = heighestPrice / livingArea
        let lowestestSqFtZillow = lowestPrice / livingArea
        setAverageSalesPriceZillow(mainPropertyPrice)
        setAverageSqFtPriceZillow(zestimatedSqFt)
        setLowestSalesPriceZillow(lowestPrice)
        setHighestSalesPriceZillow(heighestPrice)
        setLowestSqFtPriceZillow(lowestestSqFtZillow)
        setHighestSqFtPriceZillow(highestSqFtZillow)
        let priceBaseOnAverageSqFt = livingArea * perSqFtAverage
        setPriceBasedOnAveSqFt(priceBaseOnAverageSqFt)
    }


    useEffect(() => {
        if (zpid && projectData && saleProperties?.length === 0) {
            setLoadingBool(true)
            let similarPropArr = []
            let similarPropArrOnly = []
            let persqtValue = 0
            if (parseFloat(projectData?.area) > 0 && parseFloat(projectData?.zestimate) > 0) {
                persqtValue = (parseFloat(projectData?.zestimate) / parseFloat(projectData?.area)).toFixed()
            }
            const ownProp = {
                latitude: projectData?.latitude,
                longitude: projectData?.longitude,
                character: null,
                label: projectData?.displayName,
                marker_color: "",
                marker_text_color: "",
                iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                category: projectData?.category,
                address: projectData?.address,
                beds: projectData?.roomNumbers,
                baths: projectData?.bathNumbers,
                livingArea: projectData?.area,
                price: projectData?.zestimate || projectData?.price,
                perSqft: persqtValue,
                distance: 0,
                imgSrc: projectData?.displayPicture?.url,
                zpid: projectData?.zpid,
            }
            similarPropArr.push(ownProp)
            if (projectData?.salesCompsId) {
                let properties = projectData?.salesCompsId?.salesComps || [];
                properties && properties.length > 0 && properties.map((property, index) => {
                    let persqtValueForOthers = 0
                    let GenerateddistanceForOthers = 0;
                    if (parseFloat(property?.livingArea) > 0 && parseFloat(property?.price) > 0) {
                        persqtValueForOthers = (parseFloat(property?.price) / parseFloat(property?.livingArea)).toFixed()
                    }
                    if (property?.longitude && property?.latitude && ownProp?.longitude && ownProp?.latitude) {
                        GenerateddistanceForOthers = geodist({ lat: parseFloat(ownProp?.latitude), lon: parseFloat(ownProp?.longitude) }, { lat: parseFloat(property?.latitude), lon: parseFloat(property?.longitude) }, { exact: true, unit: 'mi' })
                    }
                    let alphabet = index + 1 + ""
                    const otherProp = {
                        latitude: property?.latitude,
                        longitude: property?.longitude,
                        character: alphabet,
                        label: property?.address?.streetAddress,
                        marker_color: "0000FF",
                        marker_text_color: "ffffff",
                        iconUrl: null,
                        category: property?.homeType,
                        address: property?.address,
                        beds: property?.bedrooms,
                        baths: property?.bathrooms,
                        livingArea: property?.livingArea,
                        price: property?.price,
                        perSqft: persqtValueForOthers,
                        distance: GenerateddistanceForOthers,
                        imgSrc: property?.miniCardPhotos[0]?.url,
                        zpid: property?.zpid,
                        selected: true
                    }
                    similarPropArr.push(otherProp)
                    similarPropArrOnly.push(otherProp)
                })
                setSaleProperties(similarPropArr)
                setSimilerProperties(similarPropArrOnly)
                calculateAllValues(similarPropArrOnly)
                setLoadingBool(false)
            } else {
                getSimilerProperties({ zpid: zpid, projectId: projectData?._id })
                    .then((projectRes) => {
                        setProjectData(projectRes)
                        let properties = projectRes?.salesCompsId?.salesComps || [];
                        properties && properties.length > 0 && properties.map((property, index) => {
                            let persqtValueForOthers = 0
                            let GenerateddistanceForOthers = 0;
                            if (parseFloat(property?.livingArea) > 0 && parseFloat(property?.price) > 0) {
                                persqtValueForOthers = (parseFloat(property?.price) / parseFloat(property?.livingArea)).toFixed()
                            }
                            if (property?.longitude && property?.latitude && ownProp?.longitude && ownProp?.latitude) {
                                GenerateddistanceForOthers = geodist({ lat: parseFloat(ownProp?.latitude), lon: parseFloat(ownProp?.longitude) }, { lat: parseFloat(property?.latitude), lon: parseFloat(property?.longitude) }, { exact: true, unit: 'mi' })
                            }
                            let alphabet = index + 1 + ""
                            const otherProp = {
                                latitude: property?.latitude,
                                longitude: property?.longitude,
                                character: alphabet,
                                marker_color: "0000FF",
                                marker_text_color: "ffffff",
                                iconUrl: null,
                                category: property?.homeType,
                                address: property?.address,
                                beds: property?.bedrooms,
                                baths: property?.bathrooms,
                                livingArea: property?.livingArea,
                                price: property?.price,
                                perSqft: persqtValueForOthers,
                                distance: GenerateddistanceForOthers,
                                imgSrc: property?.miniCardPhotos[0]?.url,
                                zpid: property?.zpid,
                                selected: true
                            }
                            similarPropArr.push(otherProp)
                            similarPropArrOnly.push(otherProp)
                        })
                        setSaleProperties(similarPropArr)
                        setSimilerProperties(similarPropArrOnly)
                        calculateAllValues(similarPropArrOnly)
                        setLoadingBool(false)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }

        }
    }, [zpid])


    const selectProperty = (zpid, boolValue) => {
        let modifiedProperties = []
        similerProperties && similerProperties.length > 0 && similerProperties.map((property) => {
            if (property?.zpid === zpid) {
                const newObj = {
                    ...property,
                    selected: !boolValue
                }
                modifiedProperties.push(newObj)
            } else {
                modifiedProperties.push(property)
            }
        })
        calculateAllValues(modifiedProperties)
        setSimilerProperties(modifiedProperties)
    }

    const changeFilter = (value) => {
        let updatedArr = similerProperties
        if (value === "Similarity") {
            updatedArr.sort((pro1, pro2) => {
                return parseInt(pro1.character) - parseInt(pro2.character);
            })
        } else if (value === "Distance") {
            updatedArr.sort((pro1, pro2) => {
                return pro1.distance - pro2.distance;
            })
        } else if (value === "Price") {
            updatedArr.sort((pro1, pro2) => {
                return pro2.price - pro1.price;
            })
        } else if (value === "Price/Sq.Ft.") {
            updatedArr.sort((pro1, pro2) => {
                return pro2.perSqft - pro1.perSqft;
            })
        }
        setSelectedFilter(value)
        setSimilerProperties(updatedArr)
    }

    const selectValue = async (value) => {
        if (!viewOnly) {
            setArv(value);
            await updateReport({ ARV: value });
        }
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }


    return (
        <>
            {loadingBool ? (<div className={classes.progressCont} >
                <CircularProgress />
            </div>) : (
                <>
                    {zpid ? (<>
                        {!viewOnly ? null : (
                            <div className={classes.headName} >
                                <div style={{ width: "85%" }} >
                                    <h3>Sales Comps & ARV Estimates</h3>
                                    <p></p>
                                </div>
                                <div>
                                </div>
                            </div>
                        )}
                        <Paper className={classes.estimateAndMapCont} >
                            <div className={!viewOnly ? classes.allEstimateCont : classes.allEstimateContForView} >
                                <div className={classes.zillowAndAveCont} >
                                    <div className={classes.estimateCont} >
                                        <h3>Zillow Zestimate</h3>
                                        <p>
                                            {averageSalesPriceZillow || averageSqFtPriceZillow ? (<>
                                                {!viewOnly ? (
                                                    <Tooltip title="Select the price" placement="top">
                                                        <span
                                                            className={classes.selectableValue}
                                                            onClick={() => { selectValue(averageSalesPriceZillow.toFixed()) }} >
                                                            $ {numberWithCommas(averageSalesPriceZillow.toFixed())}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span
                                                        style={{ color: "black" }}
                                                        className={classes.selectableValueWithOutHover} >
                                                        $ {numberWithCommas(averageSalesPriceZillow.toFixed())}
                                                    </span>
                                                )}
                                                <span style={{ marginLeft: "5px", color: "black" }} >($ {numberWithCommas(averageSqFtPriceZillow.toFixed())}/sq.ft.)</span>
                                            </>) : (<span style={{ color: "red" }} >Data is not available</span>)}
                                        </p>
                                        <p>
                                            {lowestSalesPriceZillow || highestSalesPriceZillow ? (<>
                                                {!viewOnly ? (
                                                    <Tooltip title="Select the price" placement="top">
                                                        <span
                                                            className={classes.selectableValue}
                                                            style={{ marginRight: "3px" }} onClick={() => { selectValue(lowestSalesPriceZillow.toFixed()) }}>
                                                            $ {numberWithCommas(lowestSalesPriceZillow.toFixed())}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span
                                                        className={classes.selectableValueWithOutHover}
                                                        style={{ marginRight: "3px", color: "black" }} >
                                                        $ {numberWithCommas(lowestSalesPriceZillow.toFixed())}
                                                    </span>
                                                )}
                                                {` - `}
                                                {!viewOnly ? (
                                                    <Tooltip title="Select the price" placement="top">
                                                        <span
                                                            className={classes.selectableValue}
                                                            style={{ marginLeft: "3px" }} onClick={() => { selectValue(highestSalesPriceZillow.toFixed()) }} >
                                                            $ {numberWithCommas(highestSalesPriceZillow.toFixed())}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span
                                                        className={classes.selectableValueWithOutHover}
                                                        style={{ marginLeft: "3px", color: "black" }} >
                                                        $ {numberWithCommas(highestSalesPriceZillow.toFixed())}
                                                    </span>
                                                )}
                                            </>) : (<span style={{ color: "red" }} >Data is not available</span>)}
                                        </p>
                                        <p style={{ color: "black", marginLeft: "7px" }} >
                                            {lowestSqFtPriceZillow || highestSqFtPriceZillow ? (
                                                <>$ {numberWithCommas(lowestSqFtPriceZillow.toFixed())}/sq.ft. {` `}  - {` `}  $ {numberWithCommas(highestSqFtPriceZillow.toFixed())}/sq.ft.</>
                                            ) : (<span style={{ color: "red" }} >Data is not available</span>)}
                                        </p>
                                    </div>
                                    <div className={classes.divider} ></div>
                                    <div className={classes.estimateCont} >
                                        <h3>Average Sale Price</h3>
                                        <p>
                                            {averageSalesPriceSP || averageSqFtPriceSP ? (<>
                                                {!viewOnly ? (
                                                    <Tooltip title="Select the price" placement="top">
                                                        <span
                                                            className={classes.selectableValue}
                                                            onClick={() => { selectValue(averageSalesPriceSP.toFixed()) }}>
                                                            $ {numberWithCommas(averageSalesPriceSP.toFixed())}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span
                                                        style={{ color: "black" }}
                                                        className={classes.selectableValueWithOutHover}>
                                                        $ {numberWithCommas(averageSalesPriceSP.toFixed())}
                                                    </span>
                                                )}
                                                <span style={{ marginLeft: "5px", color: "black" }} >($ {numberWithCommas(averageSqFtPriceSP.toFixed())}/sq.ft. )</span>
                                            </>) : (<span style={{ color: "red" }} >Data is not available</span>)}
                                        </p>
                                        <p>
                                            {lowestSalesPriceSP || highestSalesPriceSP ? (<>
                                                {!viewOnly ? (
                                                    <Tooltip title="Select the price" placement="top">
                                                        <span
                                                            className={classes.selectableValue}
                                                            style={{ marginRight: "3px" }} onClick={() => { selectValue(lowestSalesPriceSP.toFixed()) }} >
                                                            $ {numberWithCommas(lowestSalesPriceSP.toFixed())}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span
                                                        className={classes.selectableValueWithOutHover}
                                                        style={{ marginRight: "3px", color: "black" }} >
                                                        $ {numberWithCommas(lowestSalesPriceSP.toFixed())}
                                                    </span>
                                                )}
                                                {` - `}
                                                {!viewOnly ? (
                                                    <Tooltip title="Select the price" placement="top">
                                                        <span
                                                            className={classes.selectableValue}
                                                            style={{ marginLeft: "3px" }} onClick={() => { selectValue(highestSalesPriceSP.toFixed()) }} >
                                                            $ {numberWithCommas(highestSalesPriceSP.toFixed())}
                                                        </span>
                                                    </Tooltip>
                                                ) : (
                                                    <span
                                                        className={classes.selectableValueWithOutHover}
                                                        style={{ marginLeft: "3px", color: "black" }} >
                                                        $ {numberWithCommas(highestSalesPriceSP.toFixed())}
                                                    </span>
                                                )}
                                            </>) : (<span style={{ color: "red" }} >Data is not available</span>)}
                                        </p>
                                        <p style={{ color: "black", marginLeft: "7px" }} >
                                            {lowestSqFtPriceSP || highestSqFtPriceSP ? (<>
                                                $ {numberWithCommas(lowestSqFtPriceSP.toFixed())}/sq.ft. {` `}  - {` `}  $ {numberWithCommas(highestSqFtPriceSP.toFixed())}/sq.ft.
                                            </>) : (<span style={{ color: "red" }} >Data is not available</span>)}
                                        </p>
                                    </div>
                                </div>
                                <div className={classes.averageEstimateCont} >
                                    <Typography className={classes.lableStyle} >Estimated ARV Based on Average Price/Sq.Ft.</Typography>
                                    {priceBasedOnAveSqFt ? (<>
                                        {!viewOnly ? (
                                            <Tooltip title="Select the price" placement="top">
                                                <Typography
                                                    className={classes.selectableValue}
                                                    onClick={() => { selectValue(priceBasedOnAveSqFt.toFixed()) }}
                                                >
                                                    $ {numberWithCommas(priceBasedOnAveSqFt.toFixed())}
                                                </Typography>
                                            </Tooltip>
                                        ) : (
                                            <Typography
                                                style={{ color: "black" }}
                                                className={classes.selectableValueWithOutHover} >
                                                $ {numberWithCommas(priceBasedOnAveSqFt.toFixed())}
                                            </Typography>
                                        )}
                                    </>) : (
                                        <p style={{ color: "red" }} >Data is not available</p>
                                    )}
                                </div>
                                {!viewOnly ? (
                                    <div className={classes.inputAndBtn} >
                                        <div className={classes.averageEstimateCont} >
                                            <Typography className={classes.lableStyle} >Selected ARV</Typography>
                                            <TextFieldNumberFormated
                                                value={arv}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    setArv(val);
                                                    updateReport({ ARV: val });
                                                }}
                                                variant={"outlined"}
                                                style={{ width: "250px" }}
                                                size={"small"}
                                                disabled={false}
                                            />
                                        </div>
                                        <Button
                                            variant="contained"
                                            size="medium"
                                            color="primary"
                                            className={classes.marginBtn}
                                            onClick={() => { setSuggestionType("inputSheet"); }}
                                        >
                                            proceed
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                            <div className={classes.mapCont} >
                                {saleProperties && saleProperties.length > 0 && (
                                    <GoogleMapComponent
                                        marks={saleProperties}
                                        MakerType={"maker"}
                                        height={330}
                                        redius={800}
                                    />
                                )}
                            </div>
                        </Paper>
                        <div className={classes.propertiesHeader} >
                            <Typography className={classes.sectionTitle} style={{ marginLeft: "0px", marginTop: "0px" }} >Comparable Sales</Typography>
                            <MyPopOver
                                closeOnClick={true}
                                appearContent={
                                    <CustomBtn
                                        startPart={<><TrendingFlatIcon style={{ fontSize: "19px", transform: "rotate(90deg)" }} /> <SortIcon style={{ fontSize: "19px" }} /></>}
                                        text={selectedFilter}
                                    />
                                }
                                showContent={<div className={classes.filterCont} >
                                    {filterOptions && filterOptions.map((type) => (
                                        <div onClick={() => { changeFilter(type) }} >{type}</div>
                                    ))}
                                </div>}
                            />
                        </div>
                        {similerProperties && similerProperties.length > 0 && similerProperties.map((property, index) => (<>
                            <Paper className={classes.otherPropertyCont} keys={index}  >
                                <div className={classes.selectCont} >
                                    {property?.selected ? (
                                        <IconButton
                                            onClick={() => { selectProperty(property?.zpid, property?.selected) }}
                                        >
                                            <CheckCircleIcon style={{ color: theme.palette.primary.main }} />
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() => { selectProperty(property?.zpid, property?.selected) }}
                                        >
                                            <CheckCircleIcon style={{ color: "gray" }} />
                                        </IconButton>
                                    )}
                                </div>
                                <div className={classes.imgPropsAndPriceCont} >
                                    <div className={classes.imgAndPropsCont} >
                                        <img
                                            style={{
                                                width: "100px",
                                                height: "auto",
                                                maxHeight: "80px"
                                            }}
                                            src={property?.imgSrc} alt={"pic"} />
                                        <div className={classes.propertiesCont} >
                                            <Typography
                                                style={{
                                                    fontSize: "16px",
                                                    fontWeight: "500",
                                                    color: "#3E4958"
                                                }}
                                            >{property?.address?.streetAddress}, {property?.address?.city}, {property?.address?.state} {property?.address?.zipcode}</Typography>
                                            <Typography
                                                style={{
                                                    fontSize: "12px",
                                                    margin: "4px 0px",
                                                    fontWeight: "500",
                                                    color: "#898686"
                                                }}
                                            >{property?.category} / {property?.beds} Beds / {property?.baths} Baths / {property?.livingArea} Sq.Ft.</Typography>
                                            <div style={{ display: 'flex', alignItems: "center" }} >
                                                <div
                                                    style={{
                                                        color: 'white',
                                                        backgroundColor: 'green',
                                                        width: "16px",
                                                        height: "16px",
                                                        display: 'flex',
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: "50%",
                                                        marginRight: "10px",
                                                        fontSize: "12px",
                                                        fontWeight: "510"
                                                    }}
                                                >{property?.character}</div>
                                                <Typography className={classes.lableValueStyle} style={{ marginTop: "0px" }} >{property?.distance.toFixed(2)} mi Away</Typography>
                                            </div>
                                            <a
                                                target="_blank"
                                                href={"https://www.zillow.com/homes/" + property?.zpid + "_zpid/"}
                                                style={{
                                                    fontSize: "13px",
                                                    textDecoration: "none",
                                                    color: theme.palette.primary.main
                                                }}
                                            >View On Zillow <LaunchIcon style={{ fontSize: "15px", marginBottom: "-2px" }} /></a>
                                        </div>
                                    </div>
                                    <div className={classes.priceCont} >
                                        <h2>$ {numberWithCommas(property?.price)}</h2>
                                        <p>$ {numberWithCommas(property?.perSqft)}/Sq.Ft.</p>
                                    </div>
                                </div>
                            </Paper>
                        </>))}
                    </>) : (<>
                        <p style={{ textAlign: 'center', marginTop: '60px' }} >Sorry Your Property is not listed on Zillow</p>
                    </>)}
                </>)}
        </>
    );
}
