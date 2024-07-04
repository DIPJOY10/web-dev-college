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
            marginRight: "10px",
            borderRadius: "5px",
            padding: "3px 7px",
            fontSize: "14px",
            cursor: "pointer",
            fontWeight: "500",
            border: '1px solid gray',
            marginBottom: "10px",
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
}));

function LocationTags(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const theme = useTheme();

    const { locationTags, setLocationTags, docData } = props;

    const [countries, setCountries] = useState([])
    const [countryObj, setCountryObj] = useState(null)
    const [countryText, setCountryText] = useState("")


    useEffect(() => {
        let allCountries = Object.keys(countriesStateMap)
        setCountryObj(null)

        if (docData) {
            let countries = docData?.countryTag || []
            let nationWide = docData?.nationwide || []
            let statesWithCountry = docData?.stateTags || []
            let states = []

            statesWithCountry.map((sc) => {
                let arrStr = sc.split("_");
                states.push(arrStr[0])
            })

            let locationTagArr = []
            countries.map((country) => {
                let updatedCountriesArr = allCountries.filter((cun) => cun !== country);

                let tagArr = [];
                let statesLoc = countriesStateMap?.[country]

                tagArr.push({
                    name: country,
                    selected: nationWide.includes(country) ? true : false
                })

                statesLoc.map((state) => {
                    tagArr.push({
                        name: state,
                        selected: states.includes(state) ? true : false
                    })
                })

                const obj = {
                    country: country,
                    arr: tagArr
                }
                locationTagArr.push(obj)
                allCountries = updatedCountriesArr;
            })
            setLocationTags(locationTagArr)
            setCountries(allCountries)
        } else {
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
        }
    }, [docData])



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
        <div className={classes.root}>
            <div className={classes.categoriesCont} >
                <div className={classes.allCountiesCont} >
                    {locationTags && locationTags.map((loc,) => (
                        <div>
                            <p>{loc?.country}</p>
                            <CloseIcon
                                style={{ fontSize: "19px", cursor: "pointer" }}
                                onClick={() => { removeCountry(loc?.country) }}
                            />
                        </div>
                    ))}
                </div>
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
                {locationTags && locationTags.length > 0 && (<>
                    {locationTags.map((locationTagArr, j) => (<>
                        <h3 style={{ marginBottom: "5px", marginTop: "20px" }} >Country</h3>
                        <div className={classes.tagSubCont} style={{ marginBottom: "5px" }} >
                            {locationTagArr?.arr && locationTagArr?.arr.slice(0, 1).map((locationTag, i) => (
                                <div
                                    onClick={() => { onClickTag(j, i, !locationTag?.selected) }}
                                    style={locationTag?.selected ? { backgroundColor: theme.palette.primary.main, color: "white" } : {}}
                                >
                                    <p>{locationTag?.name}</p>
                                </div>
                            ))}
                        </div>
                        <h3 style={{ marginBottom: "5px" }} >States/Regions</h3>
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
        </div>
    );
}

export default LocationTags;
