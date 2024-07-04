import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { TextField } from "@material-ui/core";
import { useParams, useHistory } from "react-router-dom";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { countriesStateMap } from "../countryState"
import CloseIcon from '@material-ui/icons/Close';



const useStyles = makeStyles((theme) => ({
    categoriesCont: {
        padding: "15px 10px 5px",
        border: "1px solid gray",
    },
    tagSubCont: {
        display: "flex",
        flexWrap: "wrap",
        "& div": {
            marginRight: "5px",
            borderRadius: "5px",
            padding: "1px 3px",
            fontSize: "12px",
            cursor: "pointer",
            fontWeight: "500",
            border: '1px solid gray',
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
        }
    },
    allCountiesCont: {
        display: "flex",
        flexWrap: "wrap",
        "& div": {
            marginRight: "10px",
            borderRadius: "13px",
            padding: "4px 10px 5px",
            fontSize: "17px",
            fontWeight: "500",
            border: '1px solid gray',
            marginBottom: "10px",
            display: "flex",
            alignItems: "center",
        }
    },
    tagConts: {
        width: "100%",
        height: "calc(100% - 45px)",
        marginTop: "10px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            display: "none"
        },
        scrollbarWidth: "none",
    }
}));

function LocationFilter(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { locationTags, setLocationTags, setChangeBool, changeBool } = props;

    const [countries, setCountries] = useState([])
    const [countryObj, setCountryObj] = useState(null)
    const [countryText, setCountryText] = useState("")


    useEffect(() => {
        let allCountries = Object.keys(countriesStateMap)
        setCountryObj(null)

        let value = "United States"
        let tagArr = [];
        let states = countriesStateMap?.["United States"]
        tagArr.push({
            name: value,
            selected: false
        })
        states.map((state) => {
            tagArr.push({
                name: state,
                selected: false
            })
        })
        const obj = {
            country: value,
            arr: tagArr
        }
        setLocationTags([obj])
        setCountries(allCountries)
    }, [])



    const onClickTag = (j, i, bool) => {
        let updatedLocations = [...locationTags]
        let myArr = locationTags[j]?.arr
        let updatedArr = [...myArr]
        let updatedObj = {
            name: updatedArr[i]?.name,
            selected: bool
        }
        updatedArr[i] = updatedObj
        updatedLocations[j].arr = updatedArr

        setLocationTags(updatedLocations)
        setChangeBool(!changeBool)
    }

    const onCountrySelect = (value) => {
        if (value) {
            let updatedArr = countries.filter((loc) => loc !== value)
            setCountries(updatedArr)
            let tagArr = [];
            let states = countriesStateMap?.[value]
            tagArr.push({
                name: value,
                selected: false
            })

            states.map((state) => {
                tagArr.push({
                    name: state,
                    selected: false
                })
            })

            const obj = {
                country: value,
                arr: tagArr
            }

            let updateArr = [...locationTags, obj]
            setLocationTags(updateArr)
            setCountryText("")
            setCountryObj(null)
        }
    }

    const removeCountry = (country) => {
        let updatedNewArr = [...countries, country]
        setCountries(updatedNewArr)
        let updatedArr = locationTags.filter((loc) => loc?.country !== country)
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

            <div className={classes.tagConts} >
                {locationTags && locationTags.length > 0 && (<>
                    {locationTags.map((locationTagArr, j) => (<>
                        <h3 style={{ marginBottom: "5px", fontSize: "14px", marginTop: "5px" }} >Country</h3>
                        <div className={classes.tagSubCont} style={{ marginBottom: "5px" }} >
                            {locationTagArr?.arr && locationTagArr?.arr.slice(0, 1).map((locationTag, i) => (<>
                                <div
                                    onClick={() => { onClickTag(j, i, !locationTag?.selected) }}
                                    style={locationTag?.selected ? { backgroundColor: theme.palette.primary.main, color: "white" } : {}}
                                >
                                    <p>{locationTag?.name}</p>
                                </div>
                                <CloseIcon
                                    style={{ fontSize: "19px", cursor: "pointer", marginTop: "1px" }}
                                    onClick={() => { removeCountry(locationTag?.name) }}
                                />
                            </>))}
                        </div>
                        <h3 style={{ marginBottom: "5px", fontSize: "14px" }} >States/Regions</h3>
                        <div className={classes.tagSubCont} >
                            {locationTagArr?.arr && locationTagArr?.arr.slice(1).map((locationTag, i) => (
                                <div
                                    onClick={() => {
                                        if (!locationTagArr?.arr[0]?.selected) {
                                            onClickTag(j, i + 1, !locationTag?.selected)
                                        }
                                    }}
                                    style={(locationTag?.selected || locationTagArr?.arr[0]?.selected) ? locationTagArr?.arr[0]?.selected ? { backgroundColor: theme.palette.primary.main, color: "white", cursor: "default" } : { backgroundColor: theme.palette.primary.main, color: "white" } : {}}
                                >
                                    <p>{locationTag?.name}</p>
                                </div>
                            ))}
                        </div>
                    </>))}
                </>)}
            </div>
        </>
    );
}

export default LocationFilter;
