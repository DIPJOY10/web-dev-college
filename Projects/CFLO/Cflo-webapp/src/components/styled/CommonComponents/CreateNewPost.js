import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
    CircularProgress, Divider, IconButton, ListItemIcon,
    Menu, MenuItem, TextField, Tooltip, Button, Avatar
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import AddIcon from '@material-ui/icons/Add';
import CancelIcon from '@material-ui/icons/Cancel';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import SendIcon from '@material-ui/icons/Send';
import ImageIcon from '@material-ui/icons/Image';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MyPopOver from "./MyPopOver"
import moment from "moment";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import EditLocationIcon from '@material-ui/icons/EditLocation';
import { countriesStateMap } from "../countryState"
import Autocomplete from '@material-ui/lab/Autocomplete';
import PollIcon from "@material-ui/icons/Poll";
import "./common.css"
import CustomFileUploadButton from "../../file/Uploader/CustomFileUploadButton";
import CustomBtn from "./CustomBtn";
import CategoryCreateDialog from "./Category.Create";
import PollInput from "../../dashboard/Post/poll.input";
import AllFileViewerFeed from "./AllFiles.Viewer.Feed";
import { getAllFiles } from "./api.call";
import { BsFillTagsFill } from "react-icons/bs";
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdAddLocationAlt } from "react-icons/md";
import { ImLocation2 } from "react-icons/im";
import { RiArrowDropDownFill } from "react-icons/ri";




const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        backgroundColor: "white",
        borderRadius: "15px"
    },
    textCont: {
        paddingLeft: "50px",
        marginBottom: "10px"
    },
    noBorder: {
        border: "none",
    },
    tagCont: {
        display: "flex",
        alignItems: "center",
        paddingLeft: "20px",
    },
    onlyTagCont: {
        maxWidth: "75%",
        display: "flex",
        height: "30px",
        overflow: "hidden",
        flexWrap: "wrap",
    },
    unSelectedChip: {
        marginRight: "7px",
        marginBottom: "10px",
        marginTop: "2px",
        cursor: "pointer",
        border: "2px solid rgba(190, 190, 190, 0)",
        color: "black",
        fontSize: "13px",
        fontWeight: "400",
        padding: "2px 7px",
        borderRadius: "5px"
    },
    selectedChip: {
        marginRight: "7px",
        marginBottom: "10px",
        marginTop: "2px",
        cursor: "pointer",
        border: `2px solid ${theme.palette.primary.main}`,
        color: "black",
        fontSize: "13px",
        fontWeight: "400",
        padding: "2px 7px",
        borderRadius: "5px"
    },
    locationTagCont: {
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        flexWrap: "wrap",
    },
    locationSingleTag: {
        marginRight: "7px",
        marginBottom: "5px",
        marginTop: "5px",
        backgroundColor: theme.palette.primary.main,
        color: "white",
        padding: "0px 7px",
        borderRadius: "7px"
    },
    closeIcon: {
        position: "absolute",
        top: "14px",
        right: "15px",
        cursor: "pointer",
    },

    userPic: {
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        position: "absolute",
        top: "22px",
        left: '12px'
    },

    titleInput: {
        fontSize: "20px",
        padding: "0px",
        "& .MuiOutlinedInput-input": {
            paddingBottom: "7px",
            margin: "0px"
        }
    },
    toolbar: {
        marginTop: "10px",
        borderTop: "1px solid rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        padding: "5px 10px",
        paddingRight: "20px",
        justifyContent: "space-between"
    },
    toolbarBtn: {
        fontSize: "22px",
        marginRight: "3px",
        color: "#686868"
    },
    addText: {
        fontSize: "16px",
        fontWeight: "500",
        color: "#686868"
    },
    seeMore: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.primary.main,
        cursor: "pointer"
    },
    searchText: {
        width: "250px"
    },
    tagSearhCont: {
        height: "190px",
        marginTop: "10px",
        overflowY: "auto",
        padding: "7px",
        "& div": {
            fontWeight: "400"
        }
    },
    locationSearhCont: {
        height: "135px",
        marginTop: "10px",
        overflowY: "auto",
        padding: "7px"
    },
    actionCont: {
        width: "250px",
        height: "260px",
        padding: "10px 5px",
    },
    locationInPopOver: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 0px 5px",
        "& p": {
            fontWeight: "500",
            width: "85%"
        }
    },
    pollBox: {
        margin: "20px 0px",
        padding: "0 10px",
        borderRadius: "3px",
    },
    pollHeader: {
        color: theme.palette.primary.main,
        margin: "10px 0",
        display: "flex",
        justifyContent: "space-between",
    },
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

function getTomorrowDateTime() {
    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const date = moment(tomorrow).format("YYYY-MM-DDTkk:mm");
    return date;
}

function CreateNewPost(props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const { titlePlaceholder, descPlaceholder, noTitle, closeIt,
        categoriesStr, setCategoriesStr,
        selectedCategories, setSelectedCategories,
        selectedLocationTags, setSelectedLocationTags,
        isPoll, setIsPoll, pollOptions, setPollOptions,
        pollExireAt, setPollExireAt, publish,
        description, setDescription, title, setTitle, ...other
    } = props;

    const { createdFileIds } = useSelector((state) => state.file);
    const { user } = useSelector((state) => state.auth);

    const [countryValue, setCountryValue] = useState("")
    const [countryText, setCountryText] = useState("")
    const [countries, setCountries] = useState([])
    const [states, setStates] = useState([])
    const [stateValue, setStateValue] = useState("")
    const [stateText, setStateText] = useState("")
    const [files, setFiles] = useState([])

    useEffect(() => {
        if (createdFileIds) {
            getAllFiles({ files: createdFileIds })
                .then((data) => {
                    console.log(data)
                    setFiles(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [createdFileIds])


    useEffect(() => {
        let allCountries = Object.keys(countriesStateMap)
        let states = countriesStateMap?.["United States"]

        setCountryValue("United States")
        setCountries(allCountries)
        setStates(states)
    }, [countriesStateMap])

    const onCountrySelect = (val) => {
        setCountryValue(val)
        let states = countriesStateMap?.[val]
        setStates(states)
    }

    const onStateSelect = (val) => {
        let arr = [...selectedLocationTags, val]
        setSelectedLocationTags(arr)
        setStateValue(null)
    }

    const removeLocation = (loc) => {
        let arr = selectedLocationTags.filter(location => location !== loc)
        setSelectedLocationTags(arr)
    }

    const tagStatusChange = (tag) => {
        if (selectedCategories.includes(tag)) {
            let updatedCat = selectedCategories.filter((cat) => cat !== tag)
            setSelectedCategories(updatedCat)
        } else {
            let updatedCat = [...selectedCategories, tag]
            setSelectedCategories(updatedCat)
        }
    }

    const removeFun = (id) => {
        let allfilesId = createdFileIds.filter((_id) => _id !== id)
        let allfiles = files.filter((obj) => obj?._id !== id)

        setFiles(allfiles)
        dispatch({
            type: "AddFile",
            payload: {
                createdFileIds: [...allfilesId],
            },
        })
    }


    console.log(user)


    return (
        <div className={classes.root}>
            <CancelIcon className={classes.closeIcon} onClick={closeIt} />
            <Avatar src={user?.displayPicture?.url} className={classes.userPic} />
            <div className={classes.textCont} >
                {!noTitle && (
                    <TextField
                        variant="outlined"
                        margin="normal"
                        fullWidth
                        id="phoneNumber"
                        disableUnderline={false}
                        value={title}
                        onChange={(e) => { setTitle(e.target.value); }}
                        autoFocus
                        placeholder={titlePlaceholder || "Title"}
                        InputProps={{
                            classes: { notchedOutline: classes.noBorder },
                            className: classes.titleInput
                        }}
                        style={{ width: "90%", margin: "0px" }}
                    />
                )}
                <ReactQuill
                    {...other}
                    className='style1'
                    value={description}
                    placeholder={descPlaceholder || "Enter Message"}
                    onChange={setDescription}
                    modules={{
                        toolbar: false
                    }}
                    theme='snow'
                >
                </ReactQuill>
            </div>
            {isPoll ? (
                <div className={classes.pollBox} >
                    <div className={classes.pollHeader}>
                        <p>Poll</p>
                    </div>
                    {pollOptions.map((el, idx) => (
                        <PollInput
                            pollOptions={pollOptions}
                            idx={idx}
                            last={idx == pollOptions.length - 1}
                            setPollOptions={setPollOptions}
                            setIsPoll={setIsPoll}
                        />
                    ))}
                    <TextField
                        id="poll-expiry"
                        label="Expire On"
                        type="datetime-local"
                        color="primary"
                        defaultValue={getTomorrowDateTime()}
                        value={pollExireAt}
                        onChange={(event) => setPollExireAt(event.target.value)}
                        className={classes.textField}
                        InputLabelProps={{
                            shrink: true,
                            className: classes.textFieldInput,
                        }}
                    />
                </div>
            ) : null}
            {files && files.length > 0 && (
                <AllFileViewerFeed
                    picVideoViewerHeight={"350px"}
                    picVideoViewerHeightSmall={"250px"}
                    picVideoViewerWidth={"100%"}
                    files={files ? files : []}
                    isDeletable={true}
                    removeFun={removeFun}
                />
            )}
            <div className={classes.tagCont} >
                <BsFillTagsFill style={{ marginRight: "21px", fontSize: "24px", color: "#686868" }} />
                <div className={classes.onlyTagCont} >
                    {categoriesStr && categoriesStr.map((tag, i) => (
                        <div
                            className={selectedCategories.includes(tag) ? classes.selectedChip : classes.unSelectedChip}
                            onClick={() => { tagStatusChange(tag) }}
                            style={{ backgroundColor: colorArr[i % 7] }}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
                {categoriesStr && categoriesStr.length > 2 ? (
                    <MyPopOver
                        closeOnClick={false}
                        appearContent={
                            <div className={classes.seeMore} >
                                See All <ExpandMoreIcon style={{ marginLeft: "3px" }} />
                            </div>
                        }
                        showContent={<div className={classes.actionCont} >
                            <TextField
                                variant="outlined"
                                fullWidth
                                style={{ width: "100%" }}
                                size="small"
                                placeholder="Enter a tag..."
                                InputProps={{
                                    startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>)
                                }}
                            />
                            <div className={classes.tagSearhCont} >
                                {categoriesStr && categoriesStr.map((tag, i) => (
                                    <div
                                        className={selectedCategories.includes(tag) ? classes.selectedChip : classes.unSelectedChip}
                                        onClick={() => { tagStatusChange(tag) }}
                                        style={{ backgroundColor: colorArr[i % 7] }}
                                    >
                                        {tag}
                                    </div>
                                ))}
                            </div>
                        </div>}
                    />
                ) : null}
            </div>
            <div className={classes.tagCont} style={{ marginTop: "10px" }} >
                <FaMapMarkedAlt style={{ marginRight: "21px", fontSize: "24px", color: "#686868" }} />
                <div className={classes.locationTagCont} >
                    {selectedLocationTags && selectedLocationTags.map((location) => (<div className={classes.locationSingleTag} >
                        {location}
                    </div>))}
                </div>
            </div>
            <div className={classes.toolbar} >
                <div style={{ width: "80%", display: "flex", alignItems: "center", justifyContent: "space-around" }} >
                    <CustomFileUploadButton
                        showComponent={
                            <Button
                            >
                                <ImageIcon className={classes.toolbarBtn} />
                                <span className={classes.addText} >F<span style={{ textTransform: "lowercase" }} >ile</span></span>
                            </Button>
                        }
                        parentType={"Post"}
                        parentId={null}
                        fileNum={25}
                        givenMaxSize={26214400}
                    />
                    <Button
                        onClick={() => { setIsPoll(true) }}
                    >
                        <PollIcon className={classes.toolbarBtn} />
                        <span className={classes.addText} >P<span style={{ textTransform: "lowercase" }} >oll</span></span>
                    </Button>
                    <MyPopOver
                        closeOnClick={false}
                        appearContent={
                            <Button>
                                <ImLocation2 className={classes.toolbarBtn} />
                                <span className={classes.addText} >L<span style={{ textTransform: "lowercase" }} >ocation</span></span><RiArrowDropDownFill style={{ color: "#686868", fontSize: "20px" }} />
                            </Button>
                        }
                        showContent={<div className={classes.actionCont} >
                            <Autocomplete
                                id="free-solo-demo"
                                freeSolo
                                value={countryValue}
                                inputValue={countryText}
                                options={countries}
                                getOptionLabel={(option) => { return option }}
                                onInputChange={(event, newValue) => {
                                    setCountryText(newValue);
                                }}
                                getOptionSelected={(option) => {
                                    return option == countryValue
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        style={{ margin: "0px" }}
                                        margin="normal"
                                        variant="outlined"
                                        placeholder={"Enter Country Name"}
                                    />

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
                                value={stateValue}
                                inputValue={stateText}
                                options={states}
                                getOptionLabel={(option) => { return option }}
                                onInputChange={(event, newValue) => {
                                    setStateText(newValue);
                                }}
                                getOptionSelected={(option) => {
                                    return option == stateValue
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        style={{ margin: "0px" }}
                                        margin="normal"
                                        variant="outlined"
                                        placeholder={"Enter State Name"}
                                    />
                                )}
                                onChange={(event, value) => {
                                    onStateSelect(value)
                                }}
                                style={{ width: "100%", marginTop: "10px" }}
                                size="small"
                            />
                            <div className={classes.locationSearhCont} >
                                {selectedLocationTags && selectedLocationTags.map((location) => (<div className={classes.locationInPopOver} >
                                    <p>{location}</p> <CancelIcon onClick={() => { removeLocation(location) }} style={{ cursor: "pointer" }} />
                                </div>))}
                            </div>
                        </div>}
                    />
                </div>
                <div style={{ display: "flex", alignItems: "center" }} >
                    {selectedCategories && selectedCategories.length > 0 && description && title ? (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={publish}
                        >
                            Post
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            disabled={true}
                        >
                            post
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CreateNewPost;
