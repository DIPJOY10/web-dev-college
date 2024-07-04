import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _, { keys } from "lodash";
import { Paper, Typography } from "@material-ui/core";
import { getSimilerPropertiesForRent, updateAnalysisReport } from "./api.call";
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import LaunchIcon from '@material-ui/icons/Launch';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import MyAutocomplete from "../styled/CommonComponents/MyAutoComplete"
import CircularProgress from '@material-ui/core/CircularProgress';
import TextFieldNumberFormated from "../styled/CommonComponents/TextFieldNumberFormated";
import FastForwardIcon from '@material-ui/icons/FastForward';
import Tooltip from '@material-ui/core/Tooltip';
import GoogleMapComponent from "../styled/CommonComponents/Google.Map";
const geodist = require('geodist')


const filterOptions = ["Similarity", "Distance", "Rent", "Rent/Sq.Ft."]

const useStyles = makeStyles((theme) => ({
    titleStyle: {
        color: "#1684ea",
        fontSize: "22px",
        fontWeight: "520",
        marginBottom: "20px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "17px",
        }
    },
    salesCardCont: {
        padding: "2.5rem 0px",
    },
    estimateAndMapCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
        [theme.breakpoints.down('md')]: {
            flexDirection: "column"
        }
    },
    allEstimateCont: {
        width: "48%",
        height: "350px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: "15px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            flexDirection: "column",
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            height: "530px",
        },
    },
    allEstimateContForView: {
        width: "48%",
        height: "255px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: "15px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            flexDirection: "column",
        },
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            height: "280px",
        },
    },
    estimateCont: {
        width: "48%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            flexDirection: "column",
            marginBottom: "20px"
        }
    },
    zillowAndAveCont: {
        width: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            flexDirection: "column",
        }
    },
    averageEstimateCont: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "15px"
    },
    lableStyle: {
        fontSize: "16px",
        fontWeight: "510",
        color: "black",
        marginTop: "5px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "13px",
        }
    },
    lableValueStyle: {
        fontSize: "16px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
    },
    otherValueStyle: {
        fontSize: "15px",
        marginTop: "5px",
        fontWeight: "500",
    },
    mapCont: {
        width: "48%",
        height: "330px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            marginTop: "40px"
        }
    },
    mainPropertyCont: {
        display: "flex",
        margin: "2rem 0px",
        padding: "1rem",
        [theme.breakpoints.down('sm')]: {
            margin: "12px 0px",
            paddingRight: "20px",
            flexDirection: "column",
        }
    },
    propertiesHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        margin: "0px 2rem",
        marginTop: "80px",
        [theme.breakpoints.down('sm')]: {
            margin: "0px 1rem",
            marginTop: "80px",
            marginBottom: "20px"
        }
    },
    sectionTitle: {
        fontSize: "22px",
        fontWeight: "510",
        margin: "60px 0px 0px 0px",
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
            color: theme.palette.primary.main,
            fontWeight: "510",
            fontSize: "14px",
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
        margin: "2rem",
        padding: "1rem",
        justifyContent: "space-between",
        [theme.breakpoints.down('sm')]: {
            margin: "12px",
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
        justifyContent: "space-around",
        alignItems: "flex-end",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            alignItems: "center",
        }
    },
    marginBtn: {
        [theme.breakpoints.down('sm')]: {
            marginTop: "20px"
        }
    },
    selectableValue: {
        fontSize: "16px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
        cursor: "pointer",
        padding: "3px 7px",
        '&:hover': {
            padding: "2px 6px",
            border: "1px solid",
            borderRadius: "13px"
        }
    },
    selectableValueWithOutHover: {
        fontSize: "16px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
        padding: "3px 7px",
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
}));

export default function RentSuggestion(props) {
    const history = useHistory();
    const classes = useStyles();
    const { projectData, zpid, setCurrentReport, currentReport, reportId, teamId, setSuggestionType, setProjectData } = props;
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
    const [priceBasedOnAveSqFt, setPriceBasedOnAveSqFt] = useState(0);
    const [grossRent, setGrossRent] = useState(currentReport?.GrossRent || "");
    const [loadingBool, setLoadingBool] = useState(false);


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
                if (parseFloat(property?.livingArea) > 0 && parseFloat(property?.rent) > 0) {
                    persqtValueForOthers = (parseFloat(property?.rent) / parseFloat(property?.livingArea)).toFixed(2)
                }
                if (parseFloat(property?.rent) > maximumPrice) {
                    maximumPrice = parseFloat(property.rent);
                }
                if (parseFloat(property?.rent) < minimumPrice || minimumPrice === 0) {
                    minimumPrice = parseFloat(property.rent);
                }
                if (parseFloat(persqtValueForOthers) > maximumSqft) {
                    maximumSqft = parseFloat(persqtValueForOthers);
                }
                if (parseFloat(persqtValueForOthers) < minimumSqFt || minimumSqFt === 0) {
                    minimumSqFt = parseFloat(persqtValueForOthers);
                }
                valueTotal = valueTotal + parseFloat(property?.rent)
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
        let livingArea = parseFloat(projectData?.area) || 1
        let priceBaseOnAverageSqFt = livingArea * perSqFtAverage
        setPriceBasedOnAveSqFt(priceBaseOnAverageSqFt)
        let zillowSqFt = parseFloat(projectData?.rentZestimate) / livingArea;
        setAverageSalesPriceZillow(projectData?.rentZestimate);
        setAverageSqFtPriceZillow(zillowSqFt)
    }



    useEffect(() => {
        if (zpid && projectData && saleProperties?.length === 0) {
            setLoadingBool(true)
            let similarPropArr = []
            let similarPropArrOnly = []
            let persqtValue = 0
            if (parseFloat(projectData?.area) > 0 && parseFloat(projectData?.rentZestimate) > 0) {
                persqtValue = (parseFloat(projectData?.rentZestimate) / parseFloat(projectData?.area)).toFixed()
            }
            const ownProp = {
                latitude: projectData?.latitude,
                longitude: projectData?.longitude,
                character: null,
                marker_color: "",
                marker_text_color: "",
                iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                category: projectData?.category,
                address: projectData?.address,
                beds: projectData?.roomNumbers,
                baths: projectData?.bathNumbers,
                livingArea: projectData?.area,
                rent: projectData?.rentZestimate || 0,
                perSqft: persqtValue,
                distance: 0,
                imgSrc: projectData?.displayPicture?.url,
                zpid: projectData?.zpid,
            }
            similarPropArr.push(ownProp)

            if (projectData?.rentCompsId) {
                let properties = projectData?.rentCompsId?.rentComps
                properties && properties.length > 0 && properties.map((property, index) => {
                    let persqtValueForOthers = 0
                    let GenerateddistanceForOthers = 0;
                    if (parseFloat(property?.livingArea) > 0 && parseFloat(property?.price) > 0) {
                        persqtValueForOthers = (parseFloat(property?.price) / parseFloat(property?.livingArea)).toFixed(2)
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
                        rent: property?.price,
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
                getSimilerPropertiesForRent({ zpid: zpid, projectId: projectData?._id })
                    .then((projectRes) => {
                        setProjectData(projectRes)
                        let properties = projectRes?.rentCompsId?.rentComps || [];
                        properties && properties.length > 0 && properties.map((property, index) => {
                            let persqtValueForOthers = 0
                            let GenerateddistanceForOthers = 0;
                            if (parseFloat(property?.livingArea) > 0 && parseFloat(property?.price) > 0) {
                                persqtValueForOthers = (parseFloat(property?.price) / parseFloat(property?.livingArea)).toFixed(2)
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
                                rent: property?.price,
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
                        console.log(err);
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
        } else if (value === "Rent") {
            updatedArr.sort((pro1, pro2) => {
                return pro2.rent - pro1.rent;
            })
        } else if (value === "Rent/Sq.Ft.") {
            updatedArr.sort((pro1, pro2) => {
                return pro2.perSqft - pro1.perSqft;
            })
        }
        setSelectedFilter(value)
        setSimilerProperties(updatedArr)
    }


    const selectValue = async (value) => {
        if (setSuggestionType) {
            setGrossRent(value)
            await updateReport({ GrossRent: value });
        }
    }


    return (
        <div>{loadingBool ? (<div className={classes.progressCont} >
            <CircularProgress />
        </div>) : (<>
            {setSuggestionType ? null : (
                <div className={classes.headName} >
                    <div style={{ width: "85%" }} >
                        <h3>Rental Comps & Rent Estimates</h3>
                        <p></p>
                    </div>
                    <div>
                    </div>
                </div>
            )}
            {zpid && saleProperties && saleProperties?.length > 1 ? (<>
                <div className={classes.salesCardCont} >
                    <div className={classes.estimateAndMapCont} >
                        <Paper className={setSuggestionType ? classes.allEstimateCont : classes.allEstimateContForView} >
                            <div className={classes.zillowAndAveCont} >
                                <div className={classes.estimateCont} >
                                    <Typography className={classes.lableStyle} >Zillow Rent Estimate</Typography>
                                    {averageSalesPriceZillow ? (
                                        <Tooltip title="Select the rent" placement="top">
                                            <Typography
                                                className={setSuggestionType ? classes.selectableValue : classes.selectableValueWithOutHover}
                                                onClick={() => { selectValue(averageSalesPriceZillow.toFixed()) }}
                                            >
                                                $ {averageSalesPriceZillow.toFixed()}
                                            </Typography>
                                        </Tooltip>
                                    ) : (
                                        <p style={{ color: "red" }} >Data is not available</p>
                                    )}
                                    {averageSqFtPriceZillow ? (
                                        <Typography className={classes.lableValueStyle} >( $ {averageSqFtPriceZillow.toFixed(2)}/sq.ft. )</Typography>
                                    ) : null}
                                </div>
                                <div className={classes.estimateCont} >
                                    <Typography className={classes.lableStyle} >Average Listed Rent</Typography>
                                    {averageSalesPriceSP ? (
                                        <Tooltip title="Select the rent" placement="top">
                                            <Typography
                                                className={setSuggestionType ? classes.selectableValue : classes.selectableValueWithOutHover}
                                                onClick={() => { selectValue(averageSalesPriceSP.toFixed()) }}
                                            >
                                                $ {averageSalesPriceSP.toFixed()}
                                            </Typography>
                                        </Tooltip>
                                    ) : null}
                                    {averageSqFtPriceSP ? (
                                        <Typography className={classes.lableValueStyle} >( $ {averageSqFtPriceSP.toFixed(2)}/sq.ft. )</Typography>
                                    ) : null}
                                    {lowestSalesPriceSP && highestSalesPriceSP ? (
                                        <Typography className={classes.otherValueStyle} >
                                            <Tooltip title="Select the rent" placement="top">
                                                <span
                                                    className={setSuggestionType ? classes.selectableValue : classes.selectableValueWithOutHover}
                                                    onClick={() => { selectValue(lowestSalesPriceSP.toFixed(2)) }}
                                                >
                                                    $ {lowestSalesPriceSP.toFixed(2)}
                                                </span>
                                            </Tooltip>
                                            {` - `}
                                            <Tooltip title="Select the rent" placement="top">
                                                <span
                                                    className={setSuggestionType ? classes.selectableValue : classes.selectableValueWithOutHover}
                                                    onClick={() => { selectValue(highestSalesPriceSP.toFixed(2)) }}
                                                >
                                                    $ {highestSalesPriceSP.toFixed(2)}
                                                </span>
                                            </Tooltip>
                                        </Typography>
                                    ) : null}
                                    {lowestSqFtPriceSP && highestSqFtPriceSP ? (
                                        <Typography className={classes.otherValueStyle} >$ {lowestSqFtPriceSP.toFixed(2)}/sq.ft.  -  $ {highestSqFtPriceSP.toFixed(2)}/sq.ft.</Typography>
                                    ) : null}
                                </div>
                            </div>
                            <div className={classes.averageEstimateCont} >
                                <Typography className={classes.lableStyle} >Estimated Rent Based on Average Rent/Sq.Ft.</Typography>
                                {priceBasedOnAveSqFt ? (
                                    <Tooltip title="Select the rent" placement="top">
                                        <Typography
                                            className={setSuggestionType ? classes.selectableValue : classes.selectableValueWithOutHover}
                                            onClick={() => { selectValue(priceBasedOnAveSqFt.toFixed()) }}
                                        >
                                            $ {priceBasedOnAveSqFt.toFixed()}
                                        </Typography>
                                    </Tooltip>
                                ) : (
                                    <p style={{ color: "red" }} >Data is not available</p>
                                )}
                            </div>
                            {setSuggestionType ? (
                                <div className={classes.inputAndBtn} >
                                    <div className={classes.averageEstimateCont} >
                                        <Typography className={classes.lableStyle} >Selected Gross Rent</Typography>
                                        <TextFieldNumberFormated
                                            value={grossRent}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                setGrossRent(val)
                                                updateReport({ GrossRent: val });
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
                                        endIcon={<FastForwardIcon />}
                                        onClick={() => { setSuggestionType("inputSheet"); }}
                                    >
                                        proceed
                                    </Button>
                                </div>
                            ) : null}
                        </Paper>
                        <Paper className={classes.mapCont} >
                            <GoogleMapComponent
                                marks={saleProperties}
                                MakerType={"maker"}
                                height={330}
                                redius={800}
                            />
                        </Paper>
                    </div>
                </div>

                <div className={classes.propertiesHeader} >
                    <Typography className={classes.sectionTitle} style={{ marginLeft: "0px", marginTop: "0px" }} >Comparable Sales</Typography>
                    <div className={classes.sortCont} >
                        <MyAutocomplete
                            isSmall={false}
                            value={selectedFilter}
                            text={selectedFilterText}
                            setText={setSelectedFilterText}
                            placeholder={"Sort By"}
                            results={filterOptions}
                            getOptionLabel={(option) => { return option }}
                            onSelect={(value) => { changeFilter(value) }}
                            label={"Sort By"}
                            setWidth={"170px"}
                        />
                    </div>
                </div>
                {similerProperties && similerProperties.length > 0 && similerProperties.map((property, index) => (<>
                    <Paper className={classes.otherPropertyCont} keys={index}  >
                        <div className={classes.selectCont} >
                            {property?.selected ? (
                                <IconButton
                                    onClick={() => { selectProperty(property?.zpid, property?.selected) }}
                                >
                                    <CheckCircleIcon style={{ color: "green" }} />
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
                                            fontSize: "15px",
                                            fontWeight: "510"
                                        }}
                                    >{property?.address?.streetAddress}, {property?.address?.city}, {property?.address?.state} {property?.address?.zipcode}</Typography>
                                    <Typography
                                        style={{
                                            fontSize: "14px",
                                            fontWeight: "510",
                                            opacity: "0.9",
                                        }}
                                    >{property?.category} / {property?.beds} Beds / {property?.baths} Baths / {property?.livingArea} Sq.Ft.</Typography>
                                    <div style={{ display: 'flex', alignItems: "center" }} >
                                        <div
                                            style={{
                                                color: 'white',
                                                backgroundColor: 'green',
                                                width: "20px",
                                                height: "20px",
                                                display: 'flex',
                                                alignItems: "center",
                                                justifyContent: "center",
                                                borderRadius: "50%",
                                                marginRight: "10px",
                                                fontSize: "16px",
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
                                            textDecoration: "none"
                                        }}
                                    >View On Zillow <LaunchIcon style={{ fontSize: "15px", marginBottom: "-2px" }} /></a>
                                </div>
                            </div>
                            <div className={classes.priceCont} >
                                <h2>$ {property?.rent}</h2>
                                <p>$ {property?.perSqft}/Sq.Ft.</p>
                            </div>
                        </div>
                    </Paper>
                </>))}
            </>) : (<>
                <p style={{ textAlign: 'center', marginTop: '60px' }} >Sorry!! Something went wrong</p>
            </>)}
        </>)}
        </div>
    );
}
