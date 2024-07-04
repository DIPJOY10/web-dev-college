import React, { useEffect, useState } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { getPropertiesByAddress, selectedPropertyUse, getProjectByTeamId, getPropertyByZpid } from "./api.call";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import MyAutocomplete from '../styled/CommonComponents/MyAutoComplete'
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from "@material-ui/core";
import ImportExportIcon from '@material-ui/icons/ImportExport';
import Nodata from "../../Assets/noData_T.png"
import teamUtils from "../team/team.utils";
import Api from "../../helpers/Api";
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
const { handleTeams } = teamUtils;


const propertyType = ["Houses", "Multi-family", "Apartments", "Manufactured", "Condos", "LotsLand", "Townhomes"]

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        marginTop: "25px",
        [theme.breakpoints.down('xs')]: {
            marginTop: "10px"
        }
    },
    textFieldCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "15px",
        [theme.breakpoints.down('xs')]: {
            flexDirection: "column",
        }
    },
    inputField: {
        width: "48%",
        marginBottom: "15px",
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            marginBottom: "10px"
        }
    },
    allPropertiesCont: {
        width: "100%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        alignItems: "center",
        marginTop: "25px"
    },
    propertyCard: {
        width: "300px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        padding: "10px",
        cursor: "pointer",
    },
    propertyImg: {
        width: "25%",
        maxHeight: "150px"
    },
    propertydetails: {
        width: "calc( 300px - 25% )",
        padding: "10px",
    },
    invalidStyle: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "5px",
    },
    invalidText: {
        textAlign: 'center',
        color: 'red',
        border: '1px solid',
        borderRadius: "15px",
        padding: "3px 10px"
    },
    imgStyle: {
        width: "250px",
        height: "auto"
    },
    noDataCont: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        margin: "15px 0px"
    },
    iconClose: {
        position: "absolute",
        top: "0px",
        right: "0px"
    },
    headerBack: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    titleType: {
        fontSize: "18px",
        fontWeight: "510",
        textAlign: "center",
        marginLeft: "10px",
        [theme.breakpoints.down('sm')]: {
            fontSize: "16px",
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: "14px",
        },
    },
    optionCont: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        marginTop: "15px",
        marginLeft: "35px",
        [theme.breakpoints.down('sm')]: {
            marginTop: "10px",
            marginLeft: "15px",
        }
    },
    paperCont: {
        padding: "20px",
        margin: "30px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        boxShadow: " 0px 4px 15px rgba(0, 0, 0, 0.15)",
        [theme.breakpoints.down('sm')]: {
            padding: "10px",
            margin: "10px",
        }
    },
    inputGroupType: {
        width: "100%",
        fontSize: "16px",
        marginBottom: "15px",
        fontWeight: "510",
        color: "black",
        [theme.breakpoints.down('xs')]: {
            fontSize: "14px",
        }
    },
    actButton: {
        width: "250px",
        borderRadius: "20px",
        marginTop: "20px"
    },
    input: {
        backgroundColor: "#FCFCFC",
        padding: "5px 0px"
    },
    radiolabel: {
        fontSize: "16px",
        fontWeight: "510",
        [theme.breakpoints.down('xs')]: {
            fontSize: "12px",
            fontWeight: "500",
        }
    },
    labelStyle: {
        width: "100%",
        fontSize: "14px",
        fontWeight: "500",
        padding: "5px 0px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "12px",
        }
    },
    backIcon: {
        cursor: "pointer",
        [theme.breakpoints.down('xs')]: {
            fontSize: "20px",
        }
    }
}));

export default function ImportProperty({ projectData, setLoadingBool, setProjectData, setFindProperty }) {
    const classes = useStyles();
    const theme = useTheme();
    const { teamId } = useParams();
    const dispatch = useDispatch();

    const reduxState = useSelector((state) => state);
    const { user } = useSelector((state) => state.auth);

    const [importView, setImportView] = useState("zillowUrl")
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");
    const [propertyTypeSelected, setPropertyTypeSelected] = useState("Houses")
    const [propertyTypeText, setPropertyTypeText] = useState("")
    const [allProperties, setAllProperties] = useState([])
    const [zillowUrl, setZillowUrl] = useState("")
    const [validUrl, setValidUrl] = useState(false);
    const [validUrlZip, setValidUrlZip] = useState(false);
    const [noDataFound, setNoDataFound] = useState(null);

    const storeInRedux = async () => {
        await Api.post('team/getTeams', { profile: user.profile })
            .then((res) => {
                handleTeams(res?.teams, reduxState, dispatch);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const searchProperties = async () => {
        if (zip?.length > 4 && state?.length > 1 && city?.length > 2) {
            setLoadingBool(true)
            await getPropertiesByAddress({
                streetAddress,
                city,
                state,
                zip,
                type: propertyTypeSelected,
                projectId: projectData?._id,
                propertyTypeSelected,
                propertyName: projectData?.displayName
            })
                .then(async (propertyData) => {
                    if (propertyData?.type === "getSeveralProperties") {
                        setNoDataFound(null)
                        setValidUrlZip(false)
                        setAllProperties(propertyData?.data)
                    } else if (propertyData?.type === "getExactProperty") {
                        await getProjectByTeamId({ teamId: projectData?.team })
                            .then(async (newProject) => {
                                setNoDataFound(null)
                                setValidUrlZip(false)
                                setProjectData(newProject)
                                setFindProperty(false)
                                await storeInRedux()
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else if (propertyData?.type === "somethingWrong") {
                        setNoDataFound("ByAddress")
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            setLoadingBool(false)
        }
    }

    const selectOneProperty = async (zpid) => {
        if (zpid && projectData?._id) {
            setLoadingBool(true)
            await selectedPropertyUse({
                zpid,
                projectId: projectData?._id,
                propertyTypeSelected,
                propertyName: projectData?.displayName
            })
                .then(async (data) => {
                    if (data?.type === "getExactProperty") {
                        await getProjectByTeamId({ teamId: projectData?.team })
                            .then(async (newProject) => {
                                setNoDataFound(null)
                                setValidUrlZip(false)
                                setProjectData(newProject)
                                setFindProperty(false)
                                await storeInRedux()
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else if (data?.type === "somethingWrong") {
                        setNoDataFound("ByAddress")
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            setLoadingBool(false)
        }
    }

    const checkUrl = (value) => {
        setZillowUrl(value)
        if (value.includes("https://www.zillow.com/") && value.includes("_zpid")) {
            setValidUrl(true)
        } else {
            setValidUrl(false)
        }
    }

    const importProperty = async () => {
        setLoadingBool(true)
        const strArr = zillowUrl.split("/");
        let lastStr = strArr[strArr.length - 1];
        let secondLastStr = strArr[strArr.length - 2];
        let zpid = null;

        if (lastStr.includes("_zpid")) {
            const zipStrArr = lastStr.split("_");
            zpid = zipStrArr[0]
        } else if (secondLastStr.includes("_zpid")) {
            const zipStrArr = secondLastStr.split("_");
            zpid = zipStrArr[0]
        }

        if (zpid) {
            await getPropertyByZpid({
                projectId: projectData?._id,
                propertyTypeSelected,
                propertyName: projectData?.displayName,
                zpid
            })
                .then(async (propertyData) => {
                    if (propertyData?.type === "getExactProperty") {
                        await getProjectByTeamId({ teamId: projectData?.team })
                            .then(async (newProject) => {
                                setNoDataFound(null)
                                setValidUrlZip(false)
                                setProjectData(newProject)
                                setFindProperty(false)
                                await storeInRedux()
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    } else if (propertyData?.type === "somethingWrong") {
                        setNoDataFound("ByZillowUrl")
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            setValidUrlZip(true)
        }
        setLoadingBool(false)
    }

    const handleChangeRadio = (value) => {
        setImportView(value.target.value)
    }

    let MyView = null;

    switch (importView) {
        case "zillowUrl":
            MyView = <div className={classes.paperCont} >
                <Typography className={classes.inputGroupType} >Enter zillow url address</Typography>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    size="small"
                    placeholder="https://www.zillow.com/homes/xx-Larchwood-Dr,-Cambridge,-MA-xxxxx_rb/xxxxxxx_zpid/"
                    style={{ width: "100%" }}
                    InputProps={{ className: classes.input }}
                    value={zillowUrl}
                    onChange={(e) => { checkUrl(e.target.value) }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.actButton}
                    disabled={!validUrl}
                    endIcon={<ImportExportIcon />}
                    onClick={() => { importProperty() }}
                >
                    Import
                </Button>
                {validUrlZip ? (
                    <div className={classes.invalidStyle} >
                        <Typography className={classes.invalidText} >
                            Invalid Zillow Url ! Please check the url
                        </Typography>
                        <IconButton onClick={() => { setValidUrlZip(false) }} >
                            <CloseIcon style={{ color: "red" }} />
                        </IconButton>
                    </div>
                ) : null}

                {noDataFound === "ByZillowUrl" ? (<div className={classes.noDataCont} >
                    <img
                        src={Nodata}
                        className={classes.imgStyle}
                    />
                    <Typography>No Results Found ! please check the given inputs</Typography>
                    <IconButton
                        onClick={() => {
                            setNoDataFound(null);
                        }}
                        className={classes.iconClose}
                    >
                        <CloseIcon style={{ color: "red" }} />
                    </IconButton>
                </div>) : null}
            </div>
            break;

        case "addressSearch":
            MyView = <div className={classes.paperCont} >
                <Typography className={classes.inputGroupType} >Import By Address</Typography>
                <Typography className={classes.labelStyle} >Street Address</Typography>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    InputProps={{ className: classes.input }}
                    size="small"
                    style={{ width: "100%", marginBottom: "15px" }}
                    placeholder="ex.163 Brattle St"
                    value={streetAddress}
                    onChange={(e) => { setStreetAddress(e.target.value) }}
                />

                <div className={classes.textFieldCont} >
                    <div className={classes.inputField} >
                        <Typography className={classes.labelStyle} ><>City<span style={{ color: "red" }} >*</span></></Typography>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            style={{ width: "100%" }}
                            InputProps={{ className: classes.input }}
                            size="small"
                            placeholder="ex.Cambridge"
                            value={city}
                            onChange={(e) => { setCity(e.target.value) }}
                        />
                    </div>
                    <div className={classes.inputField} >
                        <Typography className={classes.labelStyle} ><>State/Region<span style={{ color: "red" }} >*</span></></Typography>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            style={{ width: "100%" }}
                            InputProps={{ className: classes.input }}
                            size="small"
                            placeholder="ex.MA"
                            value={state}
                            onChange={(e) => { setState(e.target.value) }}
                        />
                    </div>
                </div>
                <div className={classes.textFieldCont} >
                    <div className={classes.inputField} >
                        <Typography className={classes.labelStyle} ><>ZIP/Postal Code<span style={{ color: "red" }} >*</span></></Typography>
                        <TextField
                            id="outlined-basic"
                            variant="outlined"
                            style={{ width: "100%" }}
                            InputProps={{ className: classes.input }}
                            size="small"
                            placeholder="ex.02138"
                            value={zip}
                            onChange={(e) => { setZip(e.target.value) }}
                        />
                    </div>
                    <div className={classes.inputField} >
                        <Typography className={classes.labelStyle} >Property Type</Typography>
                        <div style={{ width: "100%", marginLeft: "-18px" }} >
                            <MyAutocomplete
                                isSmall={false}
                                value={propertyTypeSelected}
                                text={propertyTypeText}
                                setText={setPropertyTypeText}
                                placeholder={"Property Type"}
                                results={propertyType}
                                getOptionLabel={(oprion) => { return oprion }}
                                onSelect={(value) => { setPropertyTypeSelected(value) }}
                                setWidth={"100%"}
                            />
                        </div>
                    </div>
                </div>
                {
                    zip?.length > 4 && state?.length > 1 && city?.length > 2 ? (
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.actButton}
                            startIcon={<SearchIcon />}
                            onClick={() => { searchProperties() }}
                        > search
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            color="primary"
                            className={classes.actButton}
                            startIcon={<SearchIcon />}
                            disabled
                        > search
                        </Button>
                    )
                }
                {noDataFound === "ByAddress" ? (<div className={classes.noDataCont} >
                    <img
                        src={Nodata}
                        className={classes.imgStyle}
                    />
                    <Typography>No Results Found ! please check the given inputs</Typography>
                    <IconButton
                        onClick={() => {
                            setNoDataFound(null);
                        }}
                        className={classes.iconClose}
                    >
                        <CloseIcon style={{ color: "red" }} />
                    </IconButton>
                </div>) : null}
                {
                    allProperties?.length > 0 && (
                        <div className={classes.allPropertiesCont} >
                            {allProperties.map((property) => (
                                <Paper
                                    elevation={3}
                                    className={classes.propertyCard}
                                    onClick={() => { selectOneProperty(property?.zpid) }}
                                >
                                    <img className={classes.propertyImg} src={property?.imgSrc} />
                                    <div className={classes.propertydetails} >
                                        <Typography
                                            style={{
                                                fontSize: "12px",
                                                fontWeight: "510"
                                            }}
                                        >{property?.address}</Typography>
                                        <Typography
                                            style={{
                                                fontSize: "13px",
                                                fontWeight: "450"
                                            }}
                                        >{property?.propertyType} / {property?.bedrooms} beds / {property?.bathrooms} Baths / {property?.livingArea} sqft</Typography>
                                    </div>
                                </Paper>
                            ))}
                        </div>
                    )
                }
            </div>
            break;
    }


    return (
        <div className={classes.root} >
            <div className={classes.headerBack} >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
                    <KeyboardBackspaceIcon
                        onClick={() => {
                            setFindProperty(false)
                        }}
                        className={classes.backIcon}
                    />
                    <Typography className={classes.titleType} >Import Property Data</Typography>
                </div>
                <div></div>
            </div>

            <div>
                <FormControl
                    component="fieldset"
                >
                    <RadioGroup
                        className={classes.optionCont}
                        aria-label="gender"
                        name="gender1"
                        value={importView}
                        onChange={handleChangeRadio}
                    >
                        <FormControlLabel
                            value="zillowUrl"
                            control={<Radio color="primary" />}
                            label={<p className={classes.radiolabel} >Import by zillow url</p>}
                        />
                        <FormControlLabel
                            value="addressSearch"
                            control={<Radio color="primary" />}
                            label={<p className={classes.radiolabel} >Import by address</p>}
                        />
                    </RadioGroup>
                </FormControl>
            </div>
            <div>
                {MyView}
            </div>
        </div>
    );
}
