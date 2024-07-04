import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _, { keys } from "lodash";
import { Paper, Typography } from "@material-ui/core";
import { getRentEstimate } from "../api.call";
import CircularProgress from '@material-ui/core/CircularProgress';
import GoogleMapComponent from "../../styled/CommonComponents/Google.Map";


const useStyles = makeStyles((theme) => ({
    titleStyle: {
        color: "#1684ea",
        fontSize: "19px",
        fontWeight: "520",
        marginBottom: "0px",
    },
    mainCont: {
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
    },
    zillowAndAveCont: {
        width: "100%",
        padding: "15px"
    },
    lableStyle: {
        fontSize: "14px",
        fontWeight: "510",
        color: "black",
        marginTop: "5px",
    },
    lableValueStyle: {
        fontSize: "14px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
    },
    mapCont: {
        width: "48%",
        height: "230px",
    },
    dataRowCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "column"
    },
    progressCont: {
        width: "100%",
        height: "350px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    textOnly: {
        textAlign: "center",
        marginTop: "10px",
        fontWeight: "510",
        color: theme.palette.primary.main
    },
    selectableValueWithOutHover: {
        fontSize: "14px",
        fontWeight: "510",
        color: theme.palette.primary.main,
        marginTop: "5px",
        padding: "3px 7px",
    }
}));

export default function RentComEstimatePdf(props) {
    const history = useHistory();
    const classes = useStyles();
    const { projectData, zpid, setProjectData } = props;

    const [averageSalesPriceZillow, setAverageSalesPriceZillow] = useState(0);
    const [averageSqFtPriceZillow, setAverageSqFtPriceZillow] = useState(0);
    const [rentEstimateData, setRentEstimateData] = useState(null);
    const [locationArr, setLocationArr] = useState([])
    const [loadingBool, setLoadingBool] = useState(false);

    useEffect(() => {
        if (zpid && projectData && !rentEstimateData) {
            setLoadingBool(true)
            if (projectData?.rentEstimateId) {
                const data = projectData?.rentEstimateId?.rentEstimateComps;
                setRentEstimateData(data)
                const ownProp = {
                    latitude: data?.lat,
                    longitude: data?.long,
                    character: null,
                    marker_color: "",
                    marker_text_color: "",
                    iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                }
                let arr = [ownProp]
                setLocationArr(arr)
                let livingArea = parseFloat(projectData?.area) || 1
                let zillowSqFt = parseFloat(projectData?.rentZestimate) / livingArea;
                setAverageSalesPriceZillow(projectData?.rentZestimate);
                setAverageSqFtPriceZillow(zillowSqFt)
                setLoadingBool(false)
            } else {
                const bodyData = {
                    propertyType: projectData?.subCategory,
                    streetAddress: projectData?.address?.streetAddress,
                    city: projectData?.address?.city,
                    projectId: projectData?._id
                }
                getRentEstimate(bodyData)
                    .then((projectRes) => {
                        setProjectData(projectRes)
                        const data = projectRes?.rentEstimateId?.rentEstimateComps;
                        console.log(data);
                        setRentEstimateData(data)
                        const ownProp = {
                            latitude: data?.lat,
                            longitude: data?.long,
                            character: null,
                            marker_color: "",
                            marker_text_color: "",
                            iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                        }
                        let arr = [ownProp]
                        setLocationArr(arr)
                        let livingArea = parseFloat(projectData?.area) || 1
                        let zillowSqFt = parseFloat(projectData?.rentZestimate) / livingArea;
                        setAverageSalesPriceZillow(projectData?.rentZestimate);
                        setAverageSqFtPriceZillow(zillowSqFt)
                        setLoadingBool(false)
                    })
                    .catch((err) => {
                        console.log(err);
                    })
            }
        }
    }, [zpid])

    return (
        <div>{loadingBool ? (<div className={classes.progressCont} >
            <CircularProgress />
        </div>) : (
            <div className={classes.mainCont} >
                <Typography className={classes.titleStyle} >Rental Comps & Rent Estimates</Typography>
                <div className={classes.estimateAndMapCont} >
                    <Paper elevation={0} className={classes.allEstimateContForView} >
                        <div className={classes.zillowAndAveCont} >
                            <div className={classes.dataRowCont} >
                                <Typography className={classes.lableStyle} >Zillow Rent Estimate</Typography>
                                <Typography className={classes.selectableValueWithOutHover} >$ {averageSalesPriceZillow.toFixed()} ( $ {averageSqFtPriceZillow.toFixed(2)}/sq.ft. )</Typography>
                            </div>
                            <Typography className={classes.textOnly} >Based on “{rentEstimateData?.comparableRentals}” comparable rentals nearby</Typography>
                            <div className={classes.dataRowCont} >
                                <Typography className={classes.lableStyle} >Median Rent:</Typography>
                                <Typography className={classes.selectableValueWithOutHover} > $ {rentEstimateData?.median || 0}</Typography>
                            </div>
                            <div className={classes.dataRowCont} >
                                <Typography className={classes.lableStyle} >Rent Range</Typography>
                                <Typography className={classes.lableValueStyle} >$ {rentEstimateData?.lowRent || 0}{` - `}$ {rentEstimateData?.highRent || 0}</Typography>
                            </div>
                        </div>
                    </Paper>
                    <Paper elevation={0} className={classes.mapCont} >
                        <GoogleMapComponent
                            marks={locationArr}
                            MakerType={"circle"}
                            height={230}
                            redius={800}
                        />
                    </Paper>
                </div>
            </div>
        )}
        </div>
    );
}
