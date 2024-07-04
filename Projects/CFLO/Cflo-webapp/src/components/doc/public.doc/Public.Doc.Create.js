import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, IconButton, TextField, Typography, Button } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { useParams, useHistory } from "react-router-dom";
import Api from "../../../helpers/Api";
import TitleInput from "../../styled/title.input";
import DescriptionInput from "../../styled/description.input";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import useShared from "../../share/useShared.js";
import Autocomplete from '@material-ui/lab/Autocomplete';
import ShareIconBtn from "../../share/share.icon.btn.js";
import SharedList from "../../share/sharedList.js";
import useGetProfile from "../../profile/useGetProfile";
import FilesViewer from "../../file/Viewer/FilesViewer";
import FileUploadButton from "../../file/Uploader/FileUploadButton";
import { updateDeleteFlagForSingleFiles } from "../../propertyManagement/apiCall";
import useGetDocs from "./../useGetDocs";
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import LocationTags from "../../styled/CommonComponents/LocationTag";
import CategoryAutocomplete from "../../styled/CommonComponents/CategoryAutocomplate";
import CloseIcon from '@material-ui/icons/Close';



const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "white"
    },
    navBar: {
        width: "100%",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0px 7px",
    },
    mainCont: {
        width: "100%",
        height: "calc(100% - 60px)",
        padding: "10px 30px 100px",
        display: "flex",
        overflowY: "auto",
        flexDirection: "column"
    },
    flexShow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "& h3": {
            fontWeight: "500",
            fontSize: "20px"
        }
    },
    text: {
        fontSize: "20px",
        fontWeight: "500",
        margin: '20px 0px 10px'
    },
    link: {
        color: "blue",
        fontStyle: "italic",
    },
    attachIconFont: {
        fontSize: "25px",
        transform: "rotate(-20deg)",
        marginRight: "5px",
    },
    iconWithTextStyle: {
        border: `2px solid ${theme.palette.primary.main}`,
        width: "150px",
    },
    categoriesCont: {
        display: "flex",
        flexWrap: "wrap",
        "& div": {
            marginRight: "10px",
            borderRadius: "12px",
            padding: "4px 8px",
            border: '1px solid gray',
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
        }
    }
}));

function CreateProfileDoc(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { profileId } = useParams();

    const file = useSelector((state) => state.file);
    const { createdFileIds } = file;
    const { user } = useSelector((state) => state.auth);
    const userProfileId = user?.profile;
    const profile = useGetProfile(profileId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTemplateIdForEnvelope, setSelectedTemplateIdForEnvelope] = useState("");
    const [docType, setDocType] = useState("DOCUMENT");
    const [isPrivate, setPrivate] = useState(false);
    const [links, setLinks] = useState([{ title: "", link: "" }]);
    const [linkError, setLinkError] = useState(false);
    const [locationTags, setLocationTags] = useState([])
    const [categories, setCategories] = useState([])


    const sharedProps = useShared({
        initShared: [profileId, userProfileId],
        initAssigned: [],
    });

    var { privateButton, assignButton, assigness, sharedPeoples } = SharedList(sharedProps, isPrivate, setPrivate);
    const { docIds, setDocIds, docDictionary, setDocDictionary, loadingDocs } = useGetDocs(profileId);

    let avialableTemplates =
        docIds != []
            ? docIds.map((docId) => {
                if (docDictionary[docId]?.docType == "ESIGN_TEMPLATE") {
                    return { id: docId, ...docDictionary[docId] };
                } else {
                    return {};
                }
            })
            : [];

    avialableTemplates = avialableTemplates.filter(function (element) {
        return Boolean(Object.keys(element).length);
    });

    const onTitleChange = (newValue, idx) => {
        let temp = [...links];
        temp[idx]["title"] = newValue;
        setLinks([...temp]);
    };

    const onLinkChange = (newValue, idx) => {
        let temp = [...links];
        temp[idx]["link"] = newValue;
        setLinks([...temp]);
    };

    const addNew = (idx) => {
        let temp = { title: "", link: "" };
        setLinks([...links.slice(0, idx), temp, ...links.slice(idx)]);
    };

    const onDelete = (idx) => {
        if (links.length > 1) {
            setLinks([...links.slice(0, idx), ...links.slice(idx + 1)]);
        }
    };

    const removeSingleImgFromReducerAndDelete = async (selectedId) => {
        const filteredFileIds = createdFileIds.filter((id) => id != selectedId);
        dispatch({
            type: "AddFile",
            payload: {
                createdFileIds: [...filteredFileIds],
            },
        });

        await updateDeleteFlagForSingleFiles({ fileId: selectedId })
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const createDocApi = async () => {
        let check = true;
        if (links.length == 1) {
            if (Boolean(links[0].title) ^ Boolean(links[0].link)) {
                check = false;
                setLinkError(true);
                setTimeout(() => {
                    setLinkError(false);
                }, 4000);
            }
        } else {
            for (var i = 0; i < links.length; i++) {
                let temp = links[i];
                if (temp.title && temp.link) {
                    continue;
                } else {
                    check = false;
                    setLinkError(true);
                    setTimeout(() => {
                        setLinkError(false);
                    }, 4000);
                    break;
                }
            }
        }
        if (check) {
            let countryTag = []
            let nationwide = []
            let stateTags = []

            locationTags.map((loc) => {
                let locationArr = loc?.arr;
                countryTag.push(locationArr[0]?.name)

                if (locationArr[0]?.selected) {
                    nationwide.push(locationArr[0]?.name)
                }

                locationArr.map((state, i) => {
                    if (i !== 0 && state?.selected) {
                        let str = `${state?.name}_${locationArr[0]?.name}`
                        stateTags.push(str)
                    }
                })
            })

            let categoriesId = new Set([])
            let categoriesStr = new Set([]);

            categories.map((category) => {
                categoriesId.add(category?._id)
                categoriesStr.add(category?.name)
            })

            let categoriesIdArr = [...categoriesId]
            let categoriesStrArr = [...categoriesStr];

            const docObject = {
                user: user._id,
                profile: profileId,
                title,
                description,
                links,
                shared: Array.from(new Set(sharedProps?.shared)),
                assigned: sharedProps?.assigned,
                isPrivate,
                files: createdFileIds,
                activeUserId: user?._id,
                activeUserProfile: user?.profile,
                docType: "PUBLICDOC",
                countryTag: countryTag,
                nationwide: nationwide,
                stateTags: stateTags,
                tagStrs: categoriesStrArr,
                tags: categoriesIdArr,
                parentTemplate: selectedTemplateIdForEnvelope || null,
            };
            const res = await Api.post("doc/create", docObject);

            console.log(res);

            dispatch({
                type: "AddApiAlert",
                payload: {
                    success: true,
                    message: "Doc created successfully",
                },
            });
            dispatch({ type: "FileUploadReset" });
            history.goBack();
        }
    };


    return (
        <div className={classes.root}>
            <div className={classes.navBar} >
                <div className={classes.flexShow} >
                    <KeyboardBackspaceIcon
                        style={{
                            fontSize: "30px",
                            marginRight: "5px",
                            cursor: "pointer"
                        }}
                        onClick={() => {
                            history.goBack();
                        }}
                    />
                    <h3>Create Document</h3>
                </div>
                <div className={classes.flexShow} >
                    {privateButton}
                    <ShareIconBtn
                        open={sharedProps?.open}
                        setOpen={sharedProps?.setOpen}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            createDocApi();
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <div className={classes.mainCont} >
                {sharedProps?.shareDrawer}
                {sharedProps?.assignedDialog}

                <TitleInput
                    title={title}
                    placeholder={"Doc Title"}
                    setTitle={setTitle}
                    type={"Template"}
                />

                <div style={{ width: "100%", marginTop: "20px" }} >
                    <DescriptionInput
                        description={description}
                        placeholder={"Doc Description ( optional )"}
                        setDescription={setDescription}
                    />
                </div>

                <Typography className={classes.text} style={{ marginBottom: "0px" }} >Supporting Links</Typography>
                {links.map((obj, idx) => (
                    <Grid
                        container
                        style={{ width: "100%" }}
                        spacing={1}
                    >
                        <Grid item xs={5}>
                            <TextField
                                label="Title"
                                fullWidth
                                size="small"
                                value={links[idx]["title"]}
                                onChange={(e) => onTitleChange(e.target.value, idx)}
                                placeholder="Enter Title"
                                variant="outlined"
                                style={{ marginTop: "7px" }}
                            />
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                label="Link"
                                fullWidth
                                size="small"
                                value={links[idx]["link"]}
                                onChange={(e) => onLinkChange(e.target.value, idx)}
                                inputProps={{ className: classes.link }}
                                placeholder="Enter Hyperlink"
                                variant="outlined"
                                style={{ marginTop: "7px" }}
                            ></TextField>
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                style={{ display: "50%" }}
                                onClick={() => addNew(idx)}
                            >
                                <AddIcon />
                            </IconButton>
                            <IconButton
                                style={{ display: "50%" }}
                                disabled={links.length == 1}
                                onClick={() => onDelete(idx)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}
                {linkError && (
                    <Alert severity="error">
                        Please fill all fields or delete them if not required.
                    </Alert>
                )}

                <Typography variant="h4" className={classes.text}>Files</Typography>
                <FileUploadButton
                    parentType="Doc"
                    used={false}
                    parentId={null}
                    IconColor="white"
                    iconBig={true}
                    aditionalText={"Add file"}
                    attachIconStyle={classes.attachIconFont}
                    iconWithTextStyle={classes.iconWithTextStyle}
                    isDocuSignFileTypes={true}
                />
                <div style={{ marginTop: "20px" }}>
                    <FilesViewer
                        fileIds={createdFileIds}
                        deletable={true}
                        handler={removeSingleImgFromReducerAndDelete}
                    />
                </div>

                <Typography variant="h4" className={classes.text}>Category Tags</Typography>
                <CategoryAutocomplete
                    categories={categories}
                    setCategories={setCategories}
                />

                <Typography variant="h4" className={classes.text}>Location Tags</Typography>
                <LocationTags
                    locationTags={locationTags}
                    setLocationTags={setLocationTags}
                    docData={null}
                />

                <Typography variant="h4" className={classes.text}>Shared</Typography>
                <div>{sharedPeoples}</div>
            </div>
        </div>
    );
}

export default CreateProfileDoc;