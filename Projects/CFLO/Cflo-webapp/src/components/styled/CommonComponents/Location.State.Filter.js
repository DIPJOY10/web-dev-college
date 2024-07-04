import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countriesStateMap } from "../countryState"
import CloseIcon from '@material-ui/icons/Close';



const useStyles = makeStyles((theme) => ({
    statesNameCont: {
        maxHeight: "140px",
        overflowY: "auto",
        paddingTop: "10px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-start",
        "& div": {
            marginRight: "8px",
            marginBottom: "7px",
            fontSize: "16px",
            fontWeight: "400",
            padding: "2px 6px",
            borderRadius: "4px"
        }
    }
}));

const colorArr = [
    "#FFE7E7",
    "#FFEDD8",
    "#FFEFEF",
    "#F8F6E9",
    "#F8E9E9",
    "#E9F8F0",
    "#E9F8F0"
]

function LocationStateFilter(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { locationTags, setLocationTags } = props;

    const [countries, setCountries] = useState([])
    const [countryObj, setCountryObj] = useState(null)
    const [countryText, setCountryText] = useState("")
    const [states, setStates] = useState([])
    const [stateObj, setStateObj] = useState(null)
    const [stateText, setStateText] = useState("")

    useEffect(() => {
        let allCountries = Object.keys(countriesStateMap)
        let allStates = countriesStateMap?.["United States"]

        setCountryObj("United States")
        setCountries(allCountries)
        setStates(allStates)
    }, [])

    const onCountrySelect = (value) => {
        if (value) {
            let allStates = countriesStateMap?.[value]
            setStates(allStates)
            setCountryText("")
            setCountryObj(null)
        }
    }

    const onStateSelect = (val) => {
        let arr = [...locationTags, val]
        setLocationTags(arr)
        setStateObj(null)
        setStateText("")
    }

    const removeState = (loc) => {
        let updatedArr = locationTags.filter((locS) => locS !== loc)
        setLocationTags(updatedArr)
    }


    return (
        <>
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                value={countryObj}
                inputValue={countryText}
                options={countries}
                getOptionLabel={(option) => { return option }}
                onInputChange={(event, newValue) => {
                    setCountryText(newValue);
                }}
                getOptionSelected={(option) => {
                    return option == countryObj
                }}
                renderInput={(params) => (
                    <TextField {...params} style={{ margin: "0px" }} margin="normal" variant="outlined" placeholder={"Enter Country Name"} />
                )}
                onChange={(event, value) => {
                    onCountrySelect(value)
                }}
                style={{ width: "100%" }}
                size="small"
            />
            <Autocomplete
                id="free-solo-demo"
                freeSolo
                value={stateObj}
                inputValue={stateText}
                options={states}
                getOptionLabel={(option) => { return option }}
                onInputChange={(event, newValue) => {
                    setStateText(newValue);
                }}
                getOptionSelected={(option) => {
                    return option == stateObj
                }}
                renderInput={(params) => (
                    <TextField {...params} style={{ margin: "0px" }} margin="normal" variant="outlined" placeholder={"Enter Country Name"} />
                )}
                onChange={(event, value) => {
                    onStateSelect(value)
                }}
                style={{ width: "100%", marginTop: "10px" }}
                size="small"
            />
            <div className={classes.statesNameCont} >
                {locationTags && locationTags.map((loc, i) => (
                    <div
                        style={{ backgroundColor: colorArr[i % 7] }}
                    >{loc}
                        {/* <CloseIcon
                            style={{ marginLeft: "5px" }}
                            onClick={() => { removeState(loc) }}
                        /> */}
                    </div>
                ))}
            </div>
        </>
    );
}

export default LocationStateFilter;
