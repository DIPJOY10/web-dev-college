import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import { Typography } from "@material-ui/core";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import Avatar from '@material-ui/core/Avatar';
import moment from 'moment';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import LessText from '../styled/CommonComponents/LessText';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
    getRelationUnitsByProject,
    updateRentalRelationUnit,
    updateDeleteFlagForManyFiles,
    updateDeleteFlagForSingleFiles,
    createFileDocs,
    deleteFileDocs
} from "./apiCall";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import FilesViewer from '../file/Viewer/FilesViewer';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import CloseIcon from '@material-ui/icons/Close';
import AttachFileIcon from '@material-ui/icons/AttachFile';



// updateDeleteFlag

// // updateDeleteFlagForManyFiles

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: '40px'
    },
    secondaryBox: {
        width: "100%",
        border: "1px solid #E1E2E5",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px",
        marginTop: "5px",
        marginBottom: "20px"
    },
    addressCont: {
        width: "100%",
        border: "1px solid #E1E2E5",
        padding: "10px",
        marginTop: "5px",
        marginBottom: "20px"
    },
    subAddressCont: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px"
    },
    tripleInput: {
        width: "30%",
    },
    singleInput: {
        width: "100%",
        marginBottom: "20px"
    },
    duleInput: {
        width: "45%",
        marginBottom: "20px"
    },
    allDocsCont: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
    },
    docsAndTitleCont: {
        width: "90%",
        border: "1px solid gray",
        marginBottom: "20px"
    }
}));

export default function TenantDetails(props) {
    const history = useHistory();
    const classes = useStyles();
    const dispatch = useDispatch();
    const { teamId } = useParams();
    const {
        currentRentalUnit, setCurrentRentalUnit,
        setRentalUnitSettingPage, setLoadingBool
    } = props;

    const { createdFileIds } = useSelector((state) => state.file);
    const { user } = useSelector((state) => state.auth);
    const userId = user?._id;
    const profileId = user?.profile;

    const [tFName, setTFName] = useState("")
    const [tMName, setTMName] = useState("")
    const [tLName, setTLName] = useState("")
    const [tEmail, setTEmail] = useState()
    const [tContactNo, setTContactNo] = useState()
    const [tIdProofName, setTIdProofName] = useState("")
    const [tIdProofDocs, setTIdProofDocs] = useState([])

    //emergencyContact
    const [eFName, setEFName] = useState("")
    const [eMName, setEMName] = useState("")
    const [eLName, setELName] = useState("")
    const [eEmail, setEEmail] = useState()
    const [eContactNo, setEContactNo] = useState()
    const [eAddress, setEAddress] = useState()
    const [eState, setEState] = useState()
    const [eCity, setECity] = useState()
    const [eStreet, setEStreet] = useState()
    const [eZipCode, setEZipCode] = useState()

    const [stateChange, setStateChange] = useState(false);

    useEffect(() => {
        let oldTFullName = currentRentalUnit?.tenantFullInfo?.fullName || " ";
        const oldTNameArr = oldTFullName.split(' ');

        if (oldTNameArr.length === 0) {
            setTFName("")
            setTMName("")
            setTLName("")
        } else if (oldTNameArr.length === 1) {
            setTFName(oldTNameArr[0])
            setTMName("")
            setTLName("")
        } else if (oldTNameArr.length === 2) {
            setTFName(oldTNameArr[0])
            setTMName("")
            setTLName(oldTNameArr[1])
        } else if (oldTNameArr.length === 3) {
            setTFName(oldTNameArr[0])
            setTMName(oldTNameArr[1])
            setTLName(oldTNameArr[2])
        } else {

        }

        let oldTMailId = currentRentalUnit?.tenantFullInfo?.mailId || "";
        setTEmail(oldTMailId);

        let oldTContactNo = currentRentalUnit?.tenantFullInfo?.contactNumber || "";
        setTContactNo(oldTContactNo)

        let oldTIdProofDocs = currentRentalUnit?.tenantFullInfo?.idProofDocs || [];
        setTIdProofDocs(oldTIdProofDocs)

        //emergencyContact
        let oldEFullName = currentRentalUnit?.tenantFullInfo?.emergencyContact?.fullName || "";
        const oldENameArr = oldEFullName.split(' ');

        if (oldENameArr.length === 0) {
            setEFName("")
            setEMName("")
            setELName("")
        } else if (oldENameArr.length === 1) {
            setEFName(oldENameArr[0])
            setEMName("")
            setELName("")
        } else if (oldENameArr.length === 2) {
            setEFName(oldENameArr[0])
            setEMName("")
            setELName(oldENameArr[1])
        } else if (oldENameArr.length === 3) {
            setEFName(oldENameArr[0])
            setEMName(oldENameArr[1])
            setELName(oldENameArr[2])
        } else {

        }

        let oldEMailId = currentRentalUnit?.tenantFullInfo?.emergencyContact?.mailId || "";
        setEEmail(oldEMailId)

        let oldEContactNumber = currentRentalUnit?.tenantFullInfo?.emergencyContact?.contactNumber || "";
        setEContactNo(oldEContactNumber)

        let oldEAddress = currentRentalUnit?.tenantFullInfo?.emergencyContact?.address || "";
        setEAddress(oldEAddress)

        let oldEState = currentRentalUnit?.tenantFullInfo?.emergencyContact?.state || "";
        setEState(oldEState)

        let oldECity = currentRentalUnit?.tenantFullInfo?.emergencyContact?.city || "";
        setECity(oldECity)

        let oldEStreet = currentRentalUnit?.tenantFullInfo?.emergencyContact?.street || "";
        setEStreet(oldEStreet)

        let oldEZipCode = currentRentalUnit?.tenantFullInfo?.emergencyContact?.zipCode || "";
        setEZipCode(oldEZipCode)

    }, [currentRentalUnit])


    useEffect(() => {
        if (createdFileIds.length > 0) {
            createNewDocs(createdFileIds)
        }
    }, [createdFileIds])

    const createNewDocs = async (fileIds) => {
        await createFileDocs({
            title: tIdProofName,
            description: "Tenant's Id Proof Document",
            files: fileIds,
            profile: profileId,
            user: userId,
        })
            .then(async (data) => {
                console.log(data);
                let newTIdProofDocsArr = [...tIdProofDocs, data]
                setTIdProofDocs(newTIdProofDocsArr)

                await submitTenantInfo(newTIdProofDocsArr)

                removeImgFromReducer()
            })
            .catch((err) => {
                console.log(err);
            })
        setTIdProofName("")
    }

    const deleteDocAndUpdate = async (selectedDoc) => {

        let fileIDs = selectedDoc.files

        const filteredFileIds = tIdProofDocs.filter(doc => doc?._id != selectedDoc?._id);
        setTIdProofDocs(filteredFileIds)

        await submitTenantInfo(filteredFileIds)

        deleteFileDocs({ docId: selectedDoc?._id })
            .then((deletedDoc) => {

                console.log(deletedDoc)

                updateDeleteFlagForManyFiles({ fileIds: fileIDs })
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const removeImgFromReducer = () => {
        dispatch({ type: "FileUploadReset" });
    }

    const submitTenantInfo = async (currentTIdProofs) => {
        setLoadingBool(true)

        let tFullName = tFName + " " + tMName + " " + tLName;
        let trimedTFullName = tFullName.replace(/\s+/g, ' ').trim();

        let eFullName = eFName + " " + eMName + " " + eLName;
        let trimedEFullName = eFullName.replace(/\s+/g, ' ').trim();

        let docsIdsArr = []

        currentTIdProofs.length > 0 && currentTIdProofs.map((doc) => {
            docsIdsArr.push(doc?._id)
        })

        const newInfoObj = {
            fullName: trimedTFullName,
            mailId: tEmail,
            contactNumber: tContactNo,
            idProofDocs: docsIdsArr,
            isDone: true,
            emergencyContact: {
                fullName: trimedEFullName,
                mailId: eEmail,
                contactNumber: eContactNo,
                address: eAddress,
                state: eState,
                city: eCity,
                street: eStreet,
                zipCode: eZipCode,
                idProofDocs: [],
            }
        }
        if (tFName.length > 2 && tEmail.length > 6 && tContactNo.length > 5 && tIdProofDocs.length > 0) {
            newInfoObj.isDone = true;
            await updateRentalRelationUnit({
                rentalRelation: {
                    _id: currentRentalUnit._id,
                    tenantFullInfo: newInfoObj
                }
            })
                .then((data) => {
                    setStateChange(!stateChange)
                    removeImgFromReducer()
                    console.log(data)
                    setCurrentRentalUnit(data)
                    setStateChange(!stateChange)
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            newInfoObj.isDone = false;
            await updateRentalRelationUnit({
                rentalRelation: {
                    _id: currentRentalUnit._id,
                    tenantFullInfo: newInfoObj
                }
            })
                .then((data) => {
                    setStateChange(!stateChange)
                    removeImgFromReducer()
                    console.log(data)
                    setCurrentRentalUnit(data)
                    setStateChange(!stateChange)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
        setLoadingBool(false)
    }

    const goToNextStep = () => {
        setRentalUnitSettingPage("messaging")
    }


    return (
        <div className={classes.root}>
            <div style={{ width: '100%', fontSize: "17px", opacity: '0.5' }} >
                <Typography>Tenant Full Name</Typography>
            </div>
            <div className={classes.secondaryBox} >
                <TextField
                    id="outlined-basic"
                    label="First Name"
                    variant="outlined"
                    className={classes.tripleInput}
                    size="small"
                    value={tFName}
                    onChange={(e) => { setTFName(e.target.value) }}
                />
                <TextField
                    id="outlined-basic"
                    label="Middle Name"
                    variant="outlined"
                    className={classes.tripleInput}
                    size="small"
                    value={tMName}
                    onChange={(e) => { setTMName(e.target.value) }}
                />
                <TextField
                    id="outlined-basic"
                    label="Last Name"
                    variant="outlined"
                    className={classes.tripleInput}
                    size="small"
                    value={tLName}
                    onChange={(e) => { setTLName(e.target.value) }}
                />
            </div>
            <TextField
                id="outlined-basic"
                label="Mail Id"
                variant="outlined"
                className={classes.singleInput}
                size="small"
                value={tEmail}
                onChange={(e) => { setTEmail(e.target.value) }}
            />
            <TextField
                id="outlined-basic"
                label="Contact Number"
                variant="outlined"
                className={classes.singleInput}
                size="small"
                value={tContactNo}
                onChange={(e) => { setTContactNo(e.target.value) }}
            />
            <div style={{ width: '100%', fontSize: "17px", opacity: '0.5' }} >
                <Typography>Id Proof</Typography>
            </div>
            <div className={classes.addressCont} >
                <div className={classes.subAddressCont} >
                    <TextField
                        id="outlined-basic"
                        label="Id Proof Name"
                        variant="outlined"
                        style={{
                            width: "80%",
                            marginBottom: "20px"
                        }}
                        size="small"
                        value={tIdProofName}
                        onChange={(e) => { setTIdProofName(e.target.value) }}
                    />
                    {tIdProofName?.length > 2 ? (
                        <Button
                            variant="contained"
                            style={{
                                height: "40px",
                                padding: "0px",
                                backgroundColor: "#ffffff",
                                border: "2px solid #2193EF"
                            }}
                        >
                            <FileUploadButton
                                parentType='Message'
                                used={false}
                                parentId={null}
                            />
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            style={{
                                height: "40px",
                                padding: "0px",
                                backgroundColor: "#ffffff",
                                border: "2px solid #2193EF",
                            }}
                            disabled
                        >
                            <AttachFileIcon style={{ color: "#2193EF" }} />
                        </Button>
                    )}
                </div>
                <div className={classes.allDocsCont}>
                    {tIdProofDocs?.length > 0 && tIdProofDocs.map((doc) => (
                        <div className={classes.docsAndTitleCont} >
                            <div className={classes.subAddressCont}>
                                <div style={{ display: "flex", alignItems: "center", paddingLeft: "10px" }} >
                                    <InsertDriveFileIcon style={{ color: "#2193EF" }} />
                                    <Typography
                                        style={{
                                            fontSize: "17px",
                                            color: "#2193EF",
                                            marginLeft: "10px"
                                        }}
                                    >
                                        {doc?.title}
                                    </Typography>
                                </div>
                                <IconButton
                                    onClick={() => { deleteDocAndUpdate(doc) }}
                                >
                                    <CloseIcon
                                        style={{
                                            color: "red",
                                            cursor: "pointer"
                                        }}
                                    />
                                </IconButton>
                            </div>

                            <FilesViewer
                                fileIds={doc?.files}
                                styleBody={{
                                    width: '80%',
                                    height: 'auto',
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ width: '100%', fontSize: "17px", opacity: '0.5' }} >
                <Typography>Emergency Contact(optional)</Typography>
            </div>
            <div className={classes.addressCont} >
                <div style={{ width: '100%', fontSize: "16px", opacity: '0.5', marginBottom: "10px" }} >
                    <Typography>Full Name</Typography>
                </div>
                <div className={classes.subAddressCont} >
                    <TextField
                        id="outlined-basic"
                        label="First Name"
                        variant="outlined"
                        className={classes.tripleInput}
                        size="small"
                        value={eFName}
                        onChange={(e) => { setEFName(e.target.value); }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Middle Name"
                        variant="outlined"
                        className={classes.tripleInput}
                        size="small"
                        value={eMName}
                        onChange={(e) => { setEMName(e.target.value) }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Last Name"
                        variant="outlined"
                        className={classes.tripleInput}
                        size="small"
                        value={eLName}
                        onChange={(e) => { setELName(e.target.value) }}
                    />
                </div>
                <TextField
                    id="outlined-basic"
                    label="Address"
                    variant="outlined"
                    multiline
                    rows={3}
                    className={classes.singleInput}
                    size="small"
                    value={eAddress}
                    onChange={(e) => { setEAddress(e.target.value) }}
                />
                <TextField
                    id="outlined-basic"
                    label="Mail Id"
                    variant="outlined"
                    className={classes.singleInput}
                    size="small"
                    value={eEmail}
                    onChange={(e) => { setEEmail(e.target.value) }}
                />
                <TextField
                    id="outlined-basic"
                    label="Contact Number"
                    variant="outlined"
                    className={classes.singleInput}
                    size="small"
                    value={eContactNo}
                    onChange={(e) => { setEContactNo(e.target.value) }}
                />
                <div className={classes.subAddressCont} >
                    <TextField
                        id="outlined-basic"
                        label="State"
                        variant="outlined"
                        className={classes.duleInput}
                        size="small"
                        value={eState}
                        onChange={(e) => { setEState(e.target.value) }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="City"
                        variant="outlined"
                        className={classes.duleInput}
                        size="small"
                        value={eCity}
                        onChange={(e) => { setECity(e.target.value) }}
                    />
                </div>
                <div className={classes.subAddressCont} >
                    <TextField
                        id="outlined-basic"
                        label="Street"
                        variant="outlined"
                        className={classes.duleInput}
                        size="small"
                        value={eStreet}
                        onChange={(e) => { setEStreet(e.target.value) }}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Zip Code"
                        variant="outlined"
                        className={classes.duleInput}
                        size="small"
                        value={eZipCode}
                        onChange={(e) => { setEZipCode(e.target.value) }}
                    />
                </div>
            </div>
            <div className={classes.subAddressCont} style={{ marginTop: "20px" }} >
                <div></div>
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        startIcon={<SaveIcon />}
                        onClick={() => {
                            submitTenantInfo(tIdProofDocs)
                        }}
                    >
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{ marginLeft: "30px" }}
                        endIcon={<ChevronRightIcon />}
                        onClick={() => {
                            goToNextStep()
                        }}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
