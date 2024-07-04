import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from "react-router-dom";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import ButtonBase from '@material-ui/core/ButtonBase';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {
    initConversation,
    updateDeleteFlagForSingleFiles,
} from './apiCall';
import TextField from '@material-ui/core/TextField';
import { getProfileById } from '../propertyManagement/apiCall';
import { Typography } from "@material-ui/core";
import Avatar from '@material-ui/core/Avatar';
import LessText from '../styled/CommonComponents/LessText';
import IconButton from '@material-ui/core/IconButton';
import FileUploadButton from "../file/Uploader/FileUploadButton";
import FilesViewer from '../file/Viewer/FilesViewer';
import UserWithRoleComponent from '../styled/CommonComponents/UserWithRoleComponent';



const Msgroles = ["Admin", "User"]

const useStyles = makeStyles((theme) => ({
    contStyle: {
        width: "550px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        overflowY: "auto",
        paddingTop: "10px",
        [theme.breakpoints.down('sm')]: {
            width: "320px",
        },
        [theme.breakpoints.down('xs')]: {
            width: "300px",
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingBottom: "20px",
        },
    },
    dpUploadCont: {
        width: "100%",
        padding: "10px",
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        border: "1px solid #E1E2E5",
    },
    mainContStyle: {
        [theme.breakpoints.down('xs')]: {
            padding: "0px",
            maxHeight: "380px",
        }
    }
}));

const CreateGroupDialog = (props) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    var dateNow = new Date();
    const history = useHistory();
    const theme = useTheme();

    const {
        setOpenGroupCreate, openGroupCreate,
        getProfileChat, setLoadingBool
    } = props;

    const auth = useSelector((state) => state.auth);
    const { createdFileIds } = useSelector((state) => state.file);

    const [open, setOpen] = useState(false)
    const [userProfile, setUserProfile] = useState()
    const [multiInputBool, setmultiInputBool] = useState(false)
    const [participants, setParticipants] = useState([])
    const [participantsRole, setParticipantsRole] = useState([])
    const [name, setName] = useState("")
    const [msg, setMsg] = useState("")


    useEffect(() => {
        setOpen(openGroupCreate)
    }, [openGroupCreate])

    const handleClose = () => {
        setOpen(false)
        setOpenGroupCreate(false)
    }

    useEffect(() => {
        getProfileById({ profileId: auth?.user?.profile })
            .then((data) => {
                if (data) {
                    setUserProfile(data)
                    const initProfileArrs = [data]
                    setParticipants(initProfileArrs)

                    const userWithRole = [{
                        user: data,
                        role: "Admin"
                    }]
                    setParticipantsRole(userWithRole)
                }
            })
            .catch((err) => {
                console.log(err)
            })
    }, [auth?.user?.profile])

    const removeSingleImgFromReducerAndDelete = async (selectedId) => {
        const filteredFileIds = createdFileIds.filter(id => id != selectedId);

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
            })
    }

    const createGroup = async () => {
        setLoadingBool(true)
        let participantIds = []
        participants.map((participant) => {
            participantIds.push(participant?._id)
        })
        const convObj = {
            participants: participantIds,
            participantsRole,
            user: auth?.user?.profile,
            type: "Group",
            groupName: name,
            text: msg,
            groupDP: createdFileIds.length > 0 ? createdFileIds[0] : null
        };

        await initConversation(convObj)
            .then(async (data) => {
                console.log(data)

                await getProfileChat()
                setParticipants(userProfile)
                const userWithRole = [{
                    user: userProfile,
                    role: "Admin"
                }]
                setParticipantsRole(userWithRole)
                setName("")
                setMsg("")
                dispatch({ type: "FileUploadReset" });
                handleClose()
            })
            .catch((err) => {
                console.log(err);
            })
        setLoadingBool(false)
    }

    //remove user
    const removeParticipants = (id) => {
        setmultiInputBool(!multiInputBool)
        const filteredUserArr = participants.filter(user => user?._id !== id);
        setParticipants(filteredUserArr)

        let newUserAccessRoleArr = []
        participantsRole.map((userRole) => {
            if (userRole?.user?._id !== id) {
                newUserAccessRoleArr.push(userRole)
            }
        })
        setParticipantsRole(newUserAccessRoleArr)
        setmultiInputBool(!multiInputBool)
    }

    //update user role
    const updateParticipantsWithRole = (value, index) => {
        setmultiInputBool(!multiInputBool)
        let inputDataArr = participantsRole;
        let editObj = {
            ...participantsRole[index],
            role: value,
        }
        inputDataArr[index] = editObj;
        setParticipantsRole(inputDataArr)
        setmultiInputBool(!multiInputBool)
    }

    //add new user
    const addNewParticipants = (newAccessRoleObj) => {
        const accessableUserWithRoleObj = {
            user: newAccessRoleObj?.user,
            role: newAccessRoleObj?.role
        }
        let newAccessableUsersWithRoleArr = [...participantsRole, accessableUserWithRoleObj]
        setParticipantsRole(newAccessableUsersWithRoleArr);
    }



    return (
        <Dialog
            scroll={'paper'}
            onClose={handleClose}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            open={open}
        >
            <DialogTitle
                id="customized-dialog-title"
                onClose={handleClose}
                style={{ padding: "8px 24px" }}
            >
                Create Group
            </DialogTitle>
            <DialogContent dividers={true} className={classes.mainContStyle} >
                <div className={classes.contStyle} >
                    <TextField
                        label="Name"
                        id="outlined-size-small"
                        variant="outlined"
                        size="small"
                        style={{ width: "100%" }}
                        value={name}
                        onChange={(e) => { setName(e.target.value); }}
                    />

                    <div className={classes.dpUploadCont} >
                        <Typography>Upload Display Picture</Typography>

                        <FileUploadButton
                            parentType='Message'
                            used={false}
                            parentId={null}
                        />
                    </div>

                    <FilesViewer
                        fileIds={createdFileIds}
                        deletable={true}
                        styleBody={{
                            width: '50%',
                            height: 'auto',
                        }}
                        handler={removeSingleImgFromReducerAndDelete}
                    />

                    <div style={{ width: '100%', opacity: '0.5', marginTop: "20px" }} >
                        <Typography>Participants</Typography>
                    </div>
                    <UserWithRoleComponent
                        userArr={participants}
                        setUserArr={setParticipants}
                        userRoleArr={participantsRole}
                        setUserRoleArr={setParticipantsRole}
                        roles={Msgroles}
                        defaultType={"User"}
                        userProfile={auth?.user?.profile}
                        walletId={auth?.user?.wallet}
                        relationType={"Customer"}
                        userOp={true}
                        projectOp={false}
                        orgOp={true}
                        removeUserRole={removeParticipants}
                        updateRoleOfUserRole={updateParticipantsWithRole}
                        addUserRole={addNewParticipants}
                    />

                    <TextField
                        placeholder="Message"
                        id="outlined-basic"
                        variant="outlined"
                        size={"small"}
                        style={{ width: "100%" }}
                        value={msg}
                        onChange={(e) => { setMsg(e.target.value) }}
                    />
                </div>
            </DialogContent>
            <DialogActions
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <Button autoFocus onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button autoFocus onClick={() => { createGroup() }} color="primary">
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateGroupDialog;
