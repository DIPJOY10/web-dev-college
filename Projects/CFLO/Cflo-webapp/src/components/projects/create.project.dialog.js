import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";
import LinearProgress from "@material-ui/core/LinearProgress";
import teamUtils from "../team/team.utils";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import ClearIcon from '@material-ui/icons/Clear';
import Api from "../../helpers/Api";
import ProfileSelect from "../styled/profile.select";
import useGetAdminProfiles from "../profile/useGetAdminProfiles";
import GooglePlaceAutocomplete from "../styled/CommonComponents/Google.Place.Auto";

const useStyles = makeStyles((theme) => ({
    titleStyle: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 10px",
        backgroundColor: theme.palette.primary.main
    },
    mainCont: {
        [theme.breakpoints.down("sm")]: {
            padding: "10px",
            height: "62vh"
        },
        paddingTop: "0px"
    },
    projectTitle: {
        width: "100%",
        marginBottom: "15px"
    },
    textArgu: {
        display: "flex",
        marginTop: "30px",
        "& p": {
            fontSize: "12px"
        },
        [theme.breakpoints.down("sm")]: {
            "& p": {
                fontSize: "10px"
            },
        }
    },
    descStyle: {
        width: "100%",
        marginBottom: "15px",
    },
    addressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    }
}));

export default function CreateProjectDialog(props) {
    const classes = useStyles();
    const { handleTeams } = teamUtils;
    const dispatch = useDispatch();
    const { setOpen, open, onCreate, addCreatedOne } = props;

    const state = useSelector((state) => state);
    const { user, userProfile } = useSelector((state) => state.auth);
    const userId = user._id;
    const { adminProfiles } = useGetAdminProfiles();

    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [owner, setOwner] = useState(user);
    const [checkBox, setCheckBox] = useState(false)
    const [fullAddressLine, setFullAddressLine] = useState("")
    const [streetAddress, setStreetAddress] = useState("")
    const [zip, setZip] = useState("")
    const [city, setCity] = useState("")
    const [region, setRegion] = useState("")
    const [regionCode, setRegionCode] = useState("")
    const [country, setCountry] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)

    const handleClose = () => {
        setOpen(false);
    };

    const agreementSentence = "I verify that I am an author of the project and have the right to act on its behalf in the creation and management of this project. The Project is made in accordance with the terms & conditions of the community.";

    const createProjectApi = async () => {
        setLoading(true);

        let participantsArr = []
        if (user.profile == owner._id) {
            participantsArr.push(user.profile)
        } else {
            participantsArr.push(user.profile)
            participantsArr.push(owner._id)
        }
        await Api.post("project/create", {
            owner: owner._id,
            ownerModelName: owner.model,
            user: userId,
            creator: user.model === "User" ? userId : userProfile._id,
            participants: participantsArr,
            displayName: title,
            description,
            ownerProfile: owner?.profile,
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
            longitude
        }).then((team) => {
            handleTeams([team], state, dispatch);
            if (onCreate) {
                onCreate(team);
            }
            addCreatedOne(team)
            setOpen(false);
            setLoading(false);
        });
        setTitle("")
        setDescription("")
    };


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle style={{ padding: "0px" }} >
                <div className={classes.titleStyle} >
                    <p style={{ color: "white", fontSize: "17px" }}>
                        Create New Project
                    </p>
                    <ClearIcon
                        style={{ color: "white", cursor: "pointer" }}
                        onClick={handleClose}
                    />
                </div>
            </DialogTitle>
            <DialogContent dividers className={classes.mainCont} >
                <ProfileSelect
                    owner={owner}
                    adminProfiles={adminProfiles}
                    displayOwner={true}
                    title={"Project Owner"}
                    onChange={(value) => {
                        setOwner(value);
                    }}
                />
                <TextField
                    id="outlined-basic"
                    label={<>Project Title<span style={{ color: "red" }} >*</span></>}
                    variant="outlined"
                    size="small"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                    }}
                    className={classes.projectTitle}
                />
                <TextField
                    id="outlined-multiline-static"
                    label="Description"
                    rows={3}
                    variant="outlined"
                    size="small"
                    multiline
                    value={description}
                    onChange={(e) => {
                        setDescription(e.target.value);
                    }}
                    className={classes.descStyle}
                />
                <GooglePlaceAutocomplete
                    inputContStyle={classes.addressCont}
                    autoWidth={"100%"}
                    textWidth={"100%"}
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
                    isShowCountry={true}
                    isShowCityStreet={true}
                    isStateZip={true}
                />
                <div className={classes.textArgu} >
                    <Checkbox
                        checked={checkBox}
                        onChange={() => { setCheckBox(!checkBox) }}
                        color="primary"
                    />
                    <p>{agreementSentence}</p>
                </div>
            </DialogContent>
            {loading && <LinearProgress />}
            <DialogActions>
                {checkBox && title && title.length > 2 ? (
                    <Button
                        onClick={createProjectApi}
                        color="primary"
                        variant="outlined"
                        disabled={!checkBox && title.length}
                    >
                        Create
                    </Button>
                ) : (
                    <Button
                        color="primary"
                        variant="outlined"
                        disabled
                    >
                        Create
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}