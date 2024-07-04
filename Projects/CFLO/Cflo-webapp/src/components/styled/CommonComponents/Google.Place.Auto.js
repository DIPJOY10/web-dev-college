import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import axios from "axios";
import keyConfig from "../../../config/keys.config";
import MyAutocomplete from "./MyAutoComplete";
import TextField from "@material-ui/core/TextField";
import { allCountriesName } from "../allCounties.js"
import { Typography } from "@material-ui/core";
import RoomIcon from '@material-ui/icons/Room';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetLogLat from "./GetLogLat";


const useStyles = makeStyles((theme) => ({
    darkCont: {
        width: '100%',
        backgroundColor: "#f1efef",
        display: "flex",
        alignItems: "center",
        padding: "3px 5px",
        cursor: "pointer",
        '&:hover': {
            color: theme.palette.primary.main,
        }
    },
    cont: {
        width: '100%',
        display: "flex",
        alignItems: "center",
        padding: "3px 5px",
        cursor: "pointer",
        '&:hover': {
            color: theme.palette.primary.main,
        }
    },
    optionsCont: {
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        border: "1px solid #f1efef",
        overflowY: "auto"
    },
    addressCompCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        [theme.breakpoints.down("sm")]: {
            flexDirection: "column",
        }
    },
    textInput: {
        width: "47%",
        marginBottom: "15px",
        [theme.breakpoints.down("sm")]: {
            width: "100%",
        }
    },
    locationText: {
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
        fontSize: "14px",
        fontWeight: "500"
    },
    labelStyle: {
        fontSize: "14px",
        fontWeight: "500",
        padding: "5px 0px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "12px",
        }
    },
    input: {
        backgroundColor: "#FCFCFC",
    }
}));

export default function GooglePlaceAutocomplete(props) {
    const classes = useStyles();
    const {
        inputContStyle, autoWidth, textWidth, isGetLogLat,
        fullAddressLine, setFullAddressLine, streetAddress,
        setStreetAddress, zip, setZip, city, setCity, region,
        setRegion, regionCode, setRegionCode, country, setCountry,
        countryCode, setCountryCode, latitude, setLatitude,
        longitude, setLongitude, isShowCountry, isShowCityStreet,
        isStateZip
    } = props;

    const [countryText, setCountryText] = useState("")
    const [addressText, setAddressText] = useState("")
    const [addressResults, setAddressResults] = useState([])
    const [stateChange, setStateChange] = useState(false)
    const [hideOptions, setHideOptions] = useState(false)
    const [geoPointers, setGeoPointers] = useState([])

    const getAllPlaces = async (text) => {
        setStateChange(true)
        const options = {
            method: 'GET',
            url: 'https://address-completion.p.rapidapi.com/v1/geocode/autocomplete',
            params: { text: text, limit: '15', lang: 'en', countrycodes: countryCode },
            headers: {
                'X-RapidAPI-Key': keyConfig?.rapidApi,
                'X-RapidAPI-Host': 'address-completion.p.rapidapi.com'
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data);
            setAddressResults(response.data.features)
            setStateChange(false)
        }).catch(function (error) {
            console.error(error);
        });
    }

    const selectCountry = (value) => {
        if (value) {
            console.log(value)
            setCountry(value)
            let len = value.length;
            let code = value.substring(len - 3, len - 1)
            let lowCode = code.toLowerCase()
            setCountryCode(lowCode)
        }
    }

    const onAddressSelect = (address) => {
        setFullAddressLine(address?.formatted || "")
        setStreetAddress(address?.address_line1 || "")
        setZip(address?.postcode || "")
        setCity(address?.city || address?.county || "")
        setRegion(address?.state || "")
        setRegionCode(address?.state_code || "")
        setLatitude(address?.lat)
        setLongitude(address?.lon)
        setAddressResults([])
        setHideOptions(false)
    }

    useEffect(() => {
        const makerArr = [{
            latitude: latitude,
            longitude: longitude,
            character: "P",
            marker_color: "FF5F1F",
            marker_text_color: "ffffff",
        }]
        setGeoPointers(makerArr)
    }, [latitude, longitude])

    useEffect(() => {
        const getData = setTimeout(() => {
            getAllPlaces(addressText)
        }, 1000)

        return () => clearTimeout(getData)
    }, [addressText])

    return (
        <div className={inputContStyle} >
            {isShowCountry && (
                <div style={{ width: "100%" }} >
                    <Typography className={classes.labelStyle} >Country</Typography>
                    <div style={{ width: autoWidth, marginLeft: "-18px", marginBottom: "15px" }} >
                        <MyAutocomplete
                            isSmall={false}
                            value={country}
                            results={allCountriesName}
                            placeholder={"Select country name"}
                            getOptionLabel={(options) => { return options }}
                            onSelect={(value) => { selectCountry(value) }}
                            setWidth={"100%"}
                            text={countryText}
                            setText={setCountryText}
                        />
                    </div>
                </div>
            )}
            <div style={{ width: textWidth }} >
                <Typography className={classes.labelStyle} >Search Location</Typography>
                <TextField
                    id="outlined-basic"
                    variant="outlined"
                    placeholder="Enter search location"
                    value={addressText}
                    InputProps={{ className: classes.input }}
                    onChange={(e) => {
                        setAddressText(e.target.value);
                        setHideOptions(true)
                    }}
                    style={{ width: "100%" }}
                    size={"small"}
                />
                {hideOptions && addressText.length > 0 && (
                    <div className={classes.optionsCont} style={addressResults.length > 0 ? { maxHeight: "180px" } : {}} >
                        {stateChange ? (<div style={{ padding: "10px" }}>
                            <CircularProgress />
                        </div>) : (<>
                            {addressResults.length > 0 ? addressResults.map((address, i) => (
                                <div
                                    className={i % 2 === 0 ? classes.darkCont : classes.cont}
                                    onClick={() => { onAddressSelect(address?.properties) }}
                                >
                                    <RoomIcon style={{ width: "20px", height: "30px", marginRight: "5px" }} />
                                    <p style={{ color: "black", fontSize: "13px" }} >{address?.properties?.formatted}</p>
                                </div>
                            )) :
                                <p style={{ textAlign: "center", opacity: "0.7", padding: "10px" }} >Don't found any location</p>
                            }
                        </>)}
                    </div>
                )}
                <div style={{ marginTop: "20px" }} >
                    {isShowCityStreet && (
                        <div className={classes.addressCompCont} >
                            <div className={classes.textInput} >
                                <Typography className={classes.labelStyle} >Street Address</Typography>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder="Enter street address"
                                    value={streetAddress}
                                    InputProps={{ className: classes.input }}
                                    style={{ width: "100%" }}
                                    onChange={(e) => {
                                        setStreetAddress(e.target.value);
                                    }}
                                    size={"small"}
                                />
                            </div>
                            <div className={classes.textInput} >
                                <Typography className={classes.labelStyle} >City</Typography>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder="Enter city name"
                                    value={city}
                                    InputProps={{ className: classes.input }}
                                    style={{ width: "100%" }}
                                    onChange={(e) => {
                                        setCity(e.target.value);
                                    }}
                                    size={"small"}
                                />
                            </div>
                        </div>
                    )}
                    {isStateZip && (
                        <div className={classes.addressCompCont} >
                            <div className={classes.textInput} >
                                <Typography className={classes.labelStyle} >State</Typography>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder="Enter State"
                                    style={{ width: "100%" }}
                                    InputProps={{ className: classes.input }}
                                    value={region}
                                    onChange={(e) => {
                                        setRegion(e.target.value);
                                    }}
                                    size={"small"}
                                />
                            </div>
                            <div className={classes.textInput} >
                                <Typography className={classes.labelStyle} >Postal/Zip Code</Typography>
                                <TextField
                                    id="outlined-basic"
                                    variant="outlined"
                                    placeholder="Enter postal/zip code "
                                    style={{ width: "100%" }}
                                    InputProps={{ className: classes.input }}
                                    value={zip}
                                    onChange={(e) => {
                                        setZip(e.target.value);
                                    }}
                                    size={"small"}
                                />
                            </div>
                        </div>
                    )}
                </div>
                {isGetLogLat && (
                    <div>
                        {latitude && longitude && (
                            <>
                                <p className={classes.locationText} ><RoomIcon style={{ color: "blue", marginRight: "5px" }} />Place Marker</p>
                                <GetLogLat
                                    marks={geoPointers}
                                    height={250}
                                    setLatitude={setLatitude}
                                    setLongitude={setLongitude}
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
