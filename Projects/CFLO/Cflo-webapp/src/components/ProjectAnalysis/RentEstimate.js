import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useParams, useHistory } from "react-router-dom";
import _, { keys } from "lodash";
import { getRentEstimate, updateAnalysisReport } from "./api.call";
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextFieldNumberFormated from "../styled/CommonComponents/TextFieldNumberFormated";
import FastForwardIcon from '@material-ui/icons/FastForward';
import Tooltip from '@material-ui/core/Tooltip';
import GoogleMapComponent from "../styled/CommonComponents/Google.Map";


const useStyles = makeStyles((theme) => ({
    estimateAndMapCont: {
        width: "100%",
        display: "flex",
        borderRadius: "15px",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "30px",
        padding: "10px",
        backgroundColor: "white",
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down('md')]: {
            flexDirection: "column"
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
            border: "1px solid",
            backgroundColor: "#e9e9e9",
            borderRadius: "13px"
        }
    },
    allEstimateCont: {
        width: "48%",
        display: "flex",
        flexDirection: "column",
        padding: "0px 80px 0px 50px",
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
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        [theme.breakpoints.down('sm')]: {
            flexDirection: "column",
            marginBottom: "20px"
        }
    },
    zillowAndAveCont: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
    },
    averageEstimateCont: {
        display: "flex",
        alignItems: "flex-start",
        flexDirection: "column",
    },
    lableStyle: {
        fontSize: "18px",
        fontWeight: "510",
        color: "black",
        marginTop: "5px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "13px",
        }
    },
    mapCont: {
        width: "48%",
        height: "330px",
        [theme.breakpoints.down('md')]: {
            width: "100%",
            marginTop: "40px"
        }
    },
    progressCont: {
        width: "100%",
        height: "350px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    textOnly: {
        margin: "25px 0px 15px",
        fontWeight: "500",
        color: "#858484",
    },
    inputAndBtn: {
        width: "100%",
        display: "flex",
        marginTop: "20px",
        alignItems: "flex-end",
        [theme.breakpoints.down('sm')]: {

        }
    },
    marginBtn: {
        marginLeft: "10px",
        marginBottom: "2px",
        [theme.breakpoints.down('sm')]: {
            marginTop: "20px",
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
            border: "1px solid #e9e9e9",
            backgroundColor: "#e9e9e9",
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
    divider: {
        height: "30px",
        width: "1px",
        backgroundColor: "#B5B2B2",
    },
    valueStyle: {
        color: theme.palette.primary.main,
        fontWeight: "500",
        marginTop: "3px"
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

export default function RentEstimate(props) {
    const history = useHistory();
    const classes = useStyles();
    const theme = useTheme()
    const {
        projectData, zpid, setCurrentReport, currentReport,
        reportId, teamId, setSuggestionType, setProjectData,
        viewOnly
    } = props;
    const [averageSalesPriceZillow, setAverageSalesPriceZillow] = useState(0);
    const [averageSqFtPriceZillow, setAverageSqFtPriceZillow] = useState(0);
    const [grossRent, setGrossRent] = useState(currentReport?.GrossRent || "");
    const [rentEstimateData, setRentEstimateData] = useState(null);
    const [locationArr, setLocationArr] = useState([])
    const [loadingBool, setLoadingBool] = useState(false);

    const isExSmall = useMediaQuery(theme.breakpoints.down("xs"));

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

    const selectValue = async (value) => {
        if (!viewOnly) {
            setGrossRent(value)
            await updateReport({ GrossRent: value });
        }
    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <div>{loadingBool ? (<div className={classes.progressCont} >
            <CircularProgress />
        </div>) : (<>
            {zpid ? (<>
                {!viewOnly ? null : (
                    <div className={classes.headName} >
                        <div style={{ width: "85%" }} >
                            <h3>Rental Comps & Rent Estimates</h3>
                            <p></p>
                        </div>
                        <div>
                        </div>
                    </div>
                )}
                <div className={classes.estimateAndMapCont} >
                    <div className={!viewOnly ? classes.allEstimateCont : classes.allEstimateContForView} >
                        <div className={classes.averageEstimateCont} >
                            <h3 className={classes.lableStyle} >Zillow Rent Estimate</h3>
                            {averageSalesPriceZillow ? (<div>
                                {!viewOnly ? (
                                    <Tooltip title="Select the rent" placement="top">
                                        <span className={classes.selectableValue} onClick={() => { selectValue(averageSalesPriceZillow.toFixed()) }} >
                                            $ {numberWithCommas(averageSalesPriceZillow.toFixed())}
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <span style={{ color: "black", cursor: "default", fontWeight: "510" }}  >
                                        $ {numberWithCommas(averageSalesPriceZillow.toFixed())}
                                    </span>
                                )}
                                <span style={{ color: "black", cursor: "default", fontWeight: "510" }} >( $ {numberWithCommas(averageSqFtPriceZillow.toFixed(2))}/sq.ft. )</span>
                            </div>) : (
                                <p style={{ color: "red" }} >Data is not available</p>
                            )}
                        </div>
                        <p className={classes.textOnly} >Based on “{rentEstimateData?.comparableRentals}” comparable rentals nearby</p>
                        <div className={classes.zillowAndAveCont} >
                            <div className={classes.estimateCont} >
                                <h3 className={classes.lableStyle} >Median Rent</h3>
                                <p className={classes.valueStyle} >
                                    {rentEstimateData?.median ? (<>
                                        {!viewOnly ? (
                                            <Tooltip title="Select the rent" placement="top">
                                                <span className={classes.selectableValue} onClick={() => { selectValue(rentEstimateData?.median) }} >
                                                    $ {numberWithCommas(rentEstimateData?.median) || 0}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <span style={{ color: "black", cursor: "default" }} >
                                                $ {numberWithCommas(rentEstimateData?.median) || 0}
                                            </span>
                                        )}
                                    </>) : (
                                        <span style={{ color: "red" }} >Data is not available</span>
                                    )}
                                </p>
                            </div>
                            <div className={classes.divider} ></div>
                            <div className={classes.estimateCont} >
                                <h3 className={classes.lableStyle} >Rent Range</h3>
                                <p className={classes.valueStyle} >
                                    {rentEstimateData?.lowRent && rentEstimateData?.highRent ? (<>
                                        {!viewOnly ? (
                                            <Tooltip title="Select the rent" placement="top">
                                                <span className={classes.selectableValue} onClick={() => { selectValue(rentEstimateData?.lowRent) }} >
                                                    $ {numberWithCommas(rentEstimateData?.lowRent) || 0}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <span style={{ color: "black", cursor: "default" }} >
                                                $ {numberWithCommas(rentEstimateData?.lowRent) || 0}
                                            </span>
                                        )}
                                        {` - `}
                                        {!viewOnly ? (
                                            <Tooltip title="Select the rent" placement="top">
                                                <span className={classes.selectableValue} onClick={() => { selectValue(rentEstimateData?.highRent) }} >
                                                    $ {numberWithCommas(rentEstimateData?.highRent) || 0}
                                                </span>
                                            </Tooltip>
                                        ) : (
                                            <span style={{ color: "black", cursor: "default" }} >
                                                $ {numberWithCommas(rentEstimateData?.highRent) || 0}
                                            </span>
                                        )}
                                    </>) : (
                                        <span style={{ color: "red" }} >Data is not available</span>
                                    )}
                                </p>
                            </div>
                        </div>
                        {!viewOnly ? (
                            <div className={classes.inputAndBtn} >
                                <div className={classes.averageEstimateCont} >
                                    <h3 className={classes.lableStyle} >Selected Gross Rent</h3>
                                    <TextFieldNumberFormated
                                        value={grossRent}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setGrossRent(val)
                                            updateReport({ GrossRent: val });
                                        }}
                                        variant={"outlined"}
                                        style={isExSmall ? { width: "150px" } : { width: "250px" }}
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
                        <GoogleMapComponent
                            marks={locationArr}
                            MakerType={"circle"}
                            height={330}
                            redius={800}
                        />
                    </div>
                </div>
            </>) : (<p style={{ textAlign: 'center', marginTop: '60px' }} >Sorry!! Something went wrong</p>)}
        </>)}
        </div>
    );
}
