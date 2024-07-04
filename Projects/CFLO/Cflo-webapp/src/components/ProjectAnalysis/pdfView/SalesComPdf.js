import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _, { keys } from "lodash";
import { useTheme } from "@material-ui/core/styles";
import { Paper, Typography } from "@material-ui/core";
import CircularProgress from '@material-ui/core/CircularProgress';
import { getSimilerProperties } from "../api.call";
import GoogleMapComponent from "../../styled/CommonComponents/Google.Map";
const geodist = require('geodist')


const useStyles = makeStyles((theme) => ({
    titleStyle: {
        color: "#1684ea",
        fontSize: "22px",
        fontWeight: "520",
        marginBottom: "0px",
    },
    estimateAndMapCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "15px",
    },
    allEstimateContForView: {
        width: "48%",
        height: "230px",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        paddingTop: "15px",
    },
    estimateCont: {
        width: "48%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
    },
    zillowAndAveCont: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    averageEstimateCont: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "15px"
    },
    lableStyle: {
        fontSize: "14px",
        fontWeight: "510",
        color: "black",
        marginTop: "5px",
    },
    otherValueStyle: {
        fontSize: "13px",
        marginTop: "5px",
        fontWeight: "500",
    },
    lableValueStyle: {
        fontSize: "14px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
    },
    selectableValueWithOutHover: {
        fontSize: "14px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
        padding: "3px 7px",
    },
    mapCont: {
        width: "48%",
        height: "230px",
    },
    priceCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        "& h2": {
            color: theme.palette.primary.main,
            fontWeight: "510",
            fontSize: "15px",
        },
        "& p": {
            color: theme.palette.primary.main,
            fontWeight: "510",
            fontSize: "13px",
        },
    },
    otherPropertyCont: {
        display: "flex",
        margin: "9px 0px",
        padding: "9px",
        justifyContent: "space-between",
    },
    propertiesCont: {
        marginLeft: "20px",
    },
    imgPropsAndPriceCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    imgAndPropsCont: {
        display: "flex",
    },
    progressCont: {
        width: "100%",
        height: "350px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    mainCont: {
        width: "100%",
        height: "990px",
        padding: "0px 20px",
        overflow: "hidden",
    }
}));

export default function SalesComPdf(props) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme();
    const {
        projectData, zpid, setProjectData
    } = props;
    const [saleProperties, setSaleProperties] = useState([]);
    const [similerProperties, setSimilerProperties] = useState([]);
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
    const [loadingBool, setLoadingBool] = useState(false);


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
                if (similarPropArrOnly.length > 6) {
                    let propsArr = similarPropArrOnly.slice(0, 6);
                    setSimilerProperties(propsArr)
                } else {
                    setSimilerProperties(similarPropArrOnly)
                }
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
                        if (similarPropArrOnly.length > 6) {
                            let propsArr = similarPropArrOnly.slice(0, 6);
                            setSimilerProperties(propsArr)
                        } else {
                            setSimilerProperties(similarPropArrOnly)
                        }
                        calculateAllValues(similarPropArrOnly)
                        setLoadingBool(false)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }, [zpid])

    return (
        <div>{loadingBool ? (<div className={classes.progressCont} >
            <CircularProgress />
        </div>) : (
            <div className={classes.mainCont} >
                <div className={classes.salesCardCont} >
                    <Typography className={classes.titleStyle} >Sales Comps & ARV Estimates</Typography>
                    <div className={classes.estimateAndMapCont} >
                        <Paper elevation={0} className={classes.allEstimateContForView} >
                            <div className={classes.zillowAndAveCont} >
                                <div className={classes.estimateCont} >
                                    <Typography className={classes.lableStyle} >Zillow Zestimate</Typography>
                                    <Typography className={classes.selectableValueWithOutHover} >
                                        $ {averageSalesPriceZillow.toFixed()}
                                    </Typography>
                                    <Typography className={classes.lableValueStyle} >$ {averageSqFtPriceZillow.toFixed()}/sq.ft.</Typography>
                                    <Typography className={classes.otherValueStyle} > $ {lowestSalesPriceZillow.toFixed()}{` - `} $ {highestSalesPriceZillow.toFixed()}</Typography>
                                    <Typography className={classes.otherValueStyle} >$ {lowestSqFtPriceZillow.toFixed()}/sq.ft.  -  $ {highestSqFtPriceZillow.toFixed()}/sq.ft.</Typography>
                                </div>
                                <div className={classes.estimateCont} >
                                    <Typography className={classes.lableStyle} >Average Sale Price</Typography>
                                    <Typography className={classes.selectableValueWithOutHover} > $ {averageSalesPriceSP.toFixed()}</Typography>
                                    <Typography className={classes.lableValueStyle} >( $ {averageSqFtPriceSP.toFixed()}/sq.ft. )</Typography>
                                    <Typography className={classes.otherValueStyle} >$ {lowestSalesPriceSP.toFixed()}{` - `}$ {highestSalesPriceSP.toFixed()}</Typography>
                                    <Typography className={classes.otherValueStyle} >$ {lowestSqFtPriceSP.toFixed()}/sq.ft.  -  $ {highestSqFtPriceSP.toFixed()}/sq.ft.</Typography>
                                </div>
                            </div>
                            <div className={classes.averageEstimateCont} >
                                <Typography className={classes.lableStyle} >Estimated ARV Based on Average Price/Sq.Ft.</Typography>
                                <Typography className={classes.selectableValueWithOutHover}> $ {priceBasedOnAveSqFt.toFixed()} </Typography>
                            </div>
                        </Paper>
                        <Paper elevation={0} className={classes.mapCont} >
                            <GoogleMapComponent
                                marks={saleProperties}
                                MakerType={"maker"}
                                height={230}
                                redius={800}
                            />
                        </Paper>
                    </div>
                </div>
                {similerProperties && similerProperties.length > 0 && similerProperties.map((property, index) => (<>
                    <Paper elevation={0} className={classes.otherPropertyCont} keys={index}  >
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
                                            fontSize: "14px",
                                            fontWeight: "510"
                                        }}
                                    >{property?.address?.streetAddress}, {property?.address?.city}, {property?.address?.state} {property?.address?.zipcode}</Typography>
                                    <Typography
                                        style={{
                                            fontSize: "13px",
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
                                </div>
                            </div>
                            <div className={classes.priceCont} >
                                <h2>$ {property?.price}</h2>
                                <p>$ {property?.perSqft}/Sq.Ft.</p>
                            </div>
                        </div>
                    </Paper>
                </>))}
            </div>
        )}
        </div>
    );
}
