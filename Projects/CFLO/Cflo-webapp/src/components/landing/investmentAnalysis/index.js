import React, { useEffect, useState, useRef } from "react";
import { useTheme, makeStyles } from "@material-ui/core/styles";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import TextField from '@material-ui/core/TextField';
import Typography from "@material-ui/core/Typography";
import AnalysisSvg from "../../../Assets/directAnalysis.svg";
import Button from '@material-ui/core/Button';
import { handleGoogleLogin } from "../../auth/auth.utils";
import MyAutocomplete from "../../styled/CommonComponents/MyAutoComplete";
import { createProject } from "./apicall";
import { createAnalysisReport } from "../../ProjectAnalysis/api.call";
import Api from "../../../helpers/Api";
import Checkbox from '@material-ui/core/Checkbox';
import teamUtils from "../../team/team.utils";
import {
    rentalValues, brrrrValues, flipValues,
    getPropertyTaxByState, getPropertyInsuranceByState
} from "../../ProjectAnalysis/default.value.js"
import GooglePlaceAutocomplete from "../../styled/CommonComponents/Google.Place.Auto";
import NavbarLayout from "../../layout/NavbarLayout";
const { handleTeams } = teamUtils;




const useStyles = makeStyles((theme) => ({
    mainCont: {
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: "white",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
        }
    },
    leftCont: {
        width: "50%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginTop: "0px",
        }
    },
    rightCont: {
        width: "50%",
        height: "100%",
        overflowX: "hidden",
        overflowY: "auto",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
            marginTop: "0px",
            marginBottom: "40px",
        }
    },
    inputCont: {
        width: "100%",
        margin: "80px 0px 60px 0px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            marginTop: "30px",
        }
    },
    inputBox: {
        width: "50%",
        marginBottom: "15px",
        fontSize: "19px",
        fontWeight: "500",
        [theme.breakpoints.down("sm")]: {
            width: "80%",
        }
    },
    isNewCont: {
        width: "50%",
        marginBottom: "15px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginLeft: "10px",
        [theme.breakpoints.down("sm")]: {
            width: "80%",
        }
    },
    logoStyle: {
        height: "2.5rem",
    },
    logoTextSize: {
        marginLeft: "10px",
        fontSize: "1.5rem",
        fontWeight: "500",
        color: "white",
    },
    textCont: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: "30px",
        [theme.breakpoints.down("sm")]: {
            marginTop: "30px",
            paddingLeft: "15px",
        }
    },
    svgSize: {
        display: "flex",
        width: "400px",
        height: "auto",
    },
    subTextCont: {
        fontWeight: "500",
        width: "62%",
        color: "#455A64",
        fontSize: "18px",
        [theme.breakpoints.down("sm")]: {
            fontSize: "14px",
            width: "100%",
        }
    },
    loaderCont: {
        position: 'fixed',
        top: "0px",
        right: "0px",
        width: "100vw",
        height: "100vh",
        zIndex: "1000",
        paddingLeft: "0px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    InAnStyle: {
        fontSize: "40px",
        fontWeight: "600",
        color: theme.palette.primary.main,
        [theme.breakpoints.down("sm")]: {
            fontSize: "33px",
        }
    },
    addressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    labelAuto: {
        width: "50%",
        fontSize: "15px",
        fontWeight: "500",
        padding: "5px 0px",
        [theme.breakpoints.down("sm")]: {
            width: "80%",
        }
    },
    input: {
        backgroundColor: "#FCFCFC",
    },
    btnSty: {
        width: "50%",
        borderRadius: "20px",
        marginTop: "20px",
        [theme.breakpoints.down("sm")]: {
            width: "80%",
        }
    }
}));

const types = ["Rental", "BRRRR", "Flip"];

export default function Landing(props) {
    const classes = useStyles();
    const history = useHistory();
    const theme = useTheme();
    const dispatch = useDispatch();
    const { project } = useSelector((state) => state);
    const { projectDictionary, projectIds } = project
    let isSmall = useMediaQuery(theme.breakpoints.down("sm"));
    const state = useSelector((state) => state);
    const { user } = useSelector((state) => state.auth);
    const [reportName, setReportName] = useState("");
    const [squareFootage, setSquareFootage] = useState("");
    const [selectedReportType, setSelectedReportType] = useState(types[0]);
    const [selectedReportTypeText, setSelectedReportTypeText] = useState("");
    const [loadingBool, setLoadingBool] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [region, setRegion] = useState("");
    const [projectArr, setProjectArr] = useState([]);
    const [isNew, setIsNew] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [projectText, setProjectText] = useState(null)
    const [fullAddressLine, setFullAddressLine] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [zip, setZip] = useState("")
    const [city, setCity] = useState("")
    const [regionCode, setRegionCode] = useState("")
    const [country, setCountry] = useState("United States(US)")
    const [countryCode, setCountryCode] = useState("us")
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)


    useEffect(() => {
        let allProjectsArr = []
        projectIds && projectIds.length > 0 && projectIds.map((id) => {
            let projectData = projectDictionary?.[id]
            allProjectsArr.push({
                name: projectData?.displayName,
                teamId: projectData?.team,
                address: projectData?.address
            })
        })
        setProjectArr(allProjectsArr)
        if (!selectedProject && allProjectsArr.length > 0) {
            setSelectedProject(allProjectsArr[0])
        }
    }, [projectDictionary, projectIds])

    const onSelectReportType = (value) => {
        setSelectedReportType(value)
    }

    const onProjectSelect = (value) => {
        setSelectedProject(value)
        setZipCode(value?.address?.zip)
        setCity(value?.address?.city);
        setRegion(value?.address?.region);
    }


    const createAll = async () => {
        if (user?._id) {
            createProjectAndReport()
        } else {
            setIsNew(true)
            handleGoogleLogin(dispatch)
        }
    }

    const createProjectAndReport = async () => {
        if (isNew) {
            if (user?._id && reportName.length > 2 && region.length > 1) {
                let defaultObj;
                if (selectedReportType === "Rental") {
                    defaultObj = rentalValues
                } else if (selectedReportType === "BRRRR") {
                    defaultObj = brrrrValues
                } else if (selectedReportType === "Flip") {
                    defaultObj = flipValues
                }
                setLoadingBool(true)
                setLoadingMsg("We Are Building Your Project ...")
                await createProject({
                    owner: user?._id,
                    ownerModelName: "User",
                    user: user?._id,
                    creator: user?._id,
                    participants: [user.profile],
                    displayName: reportName,
                    ownerProfile: user?.profile,
                    address: {
                        fullAddressLine: fullAddressLine,
                        streetAddress: streetAddress,
                        zip: zip,
                        city: city,
                        region: region,
                        regionCode: regionCode,
                        country,
                    },
                    latitude,
                    longitude,
                    displayPicture: null,
                    area: squareFootage,
                })
                    .then(async (data) => {
                        setLoadingMsg("We Are Building Your Report ...")
                        let teamId = data?._id
                        await createAnalysisReport(
                            {
                                reportTitle: reportName,
                                reportType: selectedReportType,
                                propertyTax: getPropertyTaxByState(region),
                                propertyInsurance: getPropertyInsuranceByState(city, region),
                                ...defaultObj
                            },
                            teamId
                        )
                            .then(async (data123) => {
                                await Api.post('team/getTeams', { profile: user.profile })
                                    .then((res) => {
                                        handleTeams(res?.teams, state, dispatch);
                                    })
                                setLoadingBool(false)
                                history.push(`/analysis/${teamId}`)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        } else {
            if (user?._id && reportName.length > 2) {
                let defaultObj;
                if (selectedReportType === "Rental") {
                    defaultObj = rentalValues
                } else if (selectedReportType === "BRRRR") {
                    defaultObj = brrrrValues
                } else if (selectedReportType === "Flip") {
                    defaultObj = flipValues
                }
                setLoadingBool(true)
                setLoadingMsg("We Are Building Your Report ...")
                let teamId = selectedProject?.teamId
                await createAnalysisReport(
                    {
                        reportTitle: reportName,
                        reportType: selectedReportType,
                        propertyTax: getPropertyTaxByState(region),
                        propertyInsurance: getPropertyInsuranceByState(city, region),
                        ...defaultObj
                    },
                    teamId
                )
                    .then(async (data) => {
                        setLoadingBool(false)
                        history.push(`/analysis/${teamId}`)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
        }
    }

    useEffect(() => {
        createProjectAndReport()
    }, [user?._id])

    return (<>
        <NavbarLayout
            navHeight={"60px"}
            currentSection={"investmentAnalysis"}
            bodyComponent={<>
                <div className={classes.mainCont} >
                    <div className={classes.leftCont} >
                        <div className={classes.textCont} >
                            <img key={"timeline"} className={classes.svgSize} src={AnalysisSvg} />
                            <Typography className={classes.subTextCont} >
                                Analyze real estate investment properties(Rentals, BRRRRs, Fix & Flip). Quickly estimate cash flow, profit and investment returns projections to find the best deals.
                            </Typography>
                        </div>
                    </div>
                    <div className={classes.rightCont} >
                        <div className={classes.inputCont} >
                            <Typography className={classes.inputBox} >Analyze Unlimited Properties</Typography>
                            <p className={classes.labelAuto} >Investment Type</p>
                            <div className={classes.inputBox} style={{ marginLeft: "-36px" }} >
                                <MyAutocomplete
                                    isSmall={true}
                                    value={selectedReportType}
                                    text={selectedReportTypeText}
                                    setText={setSelectedReportTypeText}
                                    placeholder={"Investment Type"}
                                    results={types}
                                    getOptionLabel={(option) => { return option }}
                                    onSelect={onSelectReportType}
                                    setWidth={"100%"}
                                />
                            </div>
                            {user?._id && projectArr && projectArr.length > 0 ? (
                                <>
                                    <div className={classes.isNewCont} >
                                        <Typography > Create new project</Typography>
                                        <Checkbox
                                            color="primary"
                                            checked={isNew}
                                            onChange={(event) => {
                                                setIsNew(event.target.checked);
                                                if (event.target.checked) {
                                                    setZipCode("")
                                                }
                                            }}
                                        />
                                    </div>
                                    {!isNew ? (
                                        <div className={classes.inputBox} style={{ marginLeft: "-36px" }} >
                                            <MyAutocomplete
                                                isSmall={true}
                                                value={selectedProject}
                                                text={projectText}
                                                setText={setProjectText}
                                                placeholder={"Select Project"}
                                                results={projectArr}
                                                getOptionLabel={(option) => { return option.name }}
                                                onSelect={(value) => { onProjectSelect(value) }}
                                                label={"Project"}
                                                setWidth={"100%"}
                                            />
                                        </div>
                                    ) : null}
                                </>
                            ) : null}
                            <p className={classes.labelAuto} ><>Report Name<span style={{ color: "red" }} >*</span></></p>
                            <TextField
                                id="outlined-basic"
                                variant="outlined"
                                size="small"
                                placeholder="Enter Report Name"
                                InputProps={{ className: classes.input }}
                                className={classes.inputBox}
                                value={reportName}
                                onChange={(e) => { setReportName(e.target.value) }}
                            />
                            {(isNew || !user?._id) ? (
                                <GooglePlaceAutocomplete
                                    inputContStyle={classes.addressCont}
                                    autoWidth={"50%"}
                                    textWidth={"50%"}
                                    isGetLogLat={true}
                                    fullAddressLine={fullAddressLine}
                                    setFullAddressLine={setFullAddressLine}
                                    streetAddress={streetAddress}
                                    setStreetAddress={setStreetAddress}
                                    zip={zip}
                                    setZip={setZip}
                                    city={city}
                                    setCity={setCity}
                                    region={region}
                                    setRegion={setRegion}
                                    regionCode={regionCode}
                                    setRegionCode={setRegionCode}
                                    country={country}
                                    setCountry={setCountry}
                                    countryCode={countryCode}
                                    setCountryCode={setCountryCode}
                                    latitude={latitude}
                                    setLatitude={setLatitude}
                                    longitude={longitude}
                                    setLongitude={setLongitude}
                                    isShowCountry={false}
                                    isShowCityStreet={false}
                                    isStateZip={false}
                                />
                            ) : (
                                <>
                                    {/* {selectedProject?.address?.zip && selectedProject?.address?.region && selectedProject?.address?.city ? null : (
                                    <TextField
                                        id="outlined-basic"
                                        variant="outlined"
                                        label="Zip Code"
                                        size="small"
                                        className={classes.inputBox}
                                        value={zipCode}
                                        onChange={(e) => { getAddressByZipcode(e.target.value) }}
                                    />
                                )} */}
                                </>
                            )}
                            {reportName.length > 2 && ((user?._id && ((isNew && (regionCode || region)) || (!isNew && selectedProject?.teamId !== "new"))) || (!user?._id && (regionCode || region))) ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { createAll() }}
                                    className={classes.btnSty}
                                >
                                    <TrendingUpIcon style={{ marginRight: "7px" }} />
                                    {user?._id ? (<>Analyze Report</>) : (<> Sign Up & Analyze</>)}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.btnSty}
                                    disabled
                                >
                                    <TrendingUpIcon style={{ marginRight: "7px" }} />
                                    {user?._id ? (<>Proceed</>) : (<> Sign Up & Proceed</>)}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                {loadingBool &&
                    <div className={classes.loaderCont} >
                        <Typography style={{ textAlign: 'center', color: "white", fontSize: '18px' }} >{loadingMsg}</Typography>
                    </div>
                }
            </>}
        />
    </>
    );
}
