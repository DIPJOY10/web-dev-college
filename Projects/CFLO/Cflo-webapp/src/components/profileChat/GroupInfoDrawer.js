import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery } from '@material-ui/core';
import { useParams, useHistory } from 'react-router-dom';
import Drawer from "@material-ui/core/Drawer";
import CloseIcon from '@material-ui/icons/Close';
import Avatar from '@material-ui/core/Avatar';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ButtonBase from '@material-ui/core/ButtonBase';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {
    addParticipantsWithConv, updateAccessRole,
    updateConversation, updateDeleteFlagForManyFiles
} from "./apiCall";
import FileUploadButton from "../file/Uploader/FileUploadButton";
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import Autocomplete from '@material-ui/lab/Autocomplete';
import LessText from '../styled/CommonComponents/LessText';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import UserWithRoleComponent from "../styled/CommonComponents/UserWithRoleComponent";


const Msgroles = ["Admin", "User"]

const useStyles = makeStyles((theme) => ({
    drawerPaper: {
        width: "400px",
        height: "100vh",
        backgroundColor: "#ffffff",
        paddingBottom: "60px",
        [theme.breakpoints.down('xs')]: {
            height: `calc(100vh - 60px)`,
        },
        [theme.breakpoints.down('xs')]: {
            width: "350px",
            paddingBottom: "80px",
        },
    },
    topBar: {
        width: "100%",
        minHeight: "54px",
        backgroundColor: "#62B9ED",
        display: "flex",
        alignItems: "center",
        fontSize: "18px",
        color: "white"
    },
    imgNameCont: {
        width: "100%",
        height: "300px",
        backgroundColor: "#F0F2F5",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        flexDirection: "column",
        position: "relative",
        padding: "15px 0px"
    },
    imgStyle: {
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        overflow: "hidden",
    },
    ParticipantsCont: {
        width: "100%",
        backgroundColor: "#F0F2F5",
        marginTop: "20px",
        position: "relative",
    },
    participantRow: {
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "3px 15px",
        borderBottom: "1px solid #E1E2E5",
        '&:hover': {
            backgroundColor: "#e3e3e4",
        },
    },
    addParticipantCont: {
        width: "100%",
        display: "flex",
        alignItems: "center",
        padding: "6px 15px",
        cursor: "pointer",
        '&:hover': {
            backgroundColor: "#e3e3e4",
        },
    },
    participantPhotoNameCont: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    cameraStyle: {
        position: "absolute",
        top: "160px",
        left: "250px",
        fontSize: "54px",
        cursor: "pointer",
        [theme.breakpoints.down('xs')]: {
            left: "220px",
        },
    },
    groupNameEditCont: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        fontSize: "20px"
    },
    groupNameCont: {
        maxWidth: "80%",
        overflow: "hidden",
        marginRight: "10px",
    },
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
    dialogStyle: {
        top: "-20px"
    },
    mainContStyle: {
        [theme.breakpoints.down('xs')]: {
            padding: "0px",
            maxHeight: "380px",
        }
    }
}));

const GroupInfoDrawer = (props) => {
    const classes = useStyles();
    const theme = useTheme();
    const dispatch = useDispatch();
    const history = useHistory();
    const DateNow = new Date();
    const {
        groupInfoOpen, setGroupInfoOpen, setLoadingBool,
        conversationId, conversationDictionary,
        setConversationDictionary, getProfileChat
    } = props;

    const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
    const isOnlyMd = useMediaQuery(theme.breakpoints.only('md'));
    const { createdFileIds } = useSelector((state) => state.file);
    const auth = useSelector((state) => state.auth);

    const [openDrawer, setOpenDrawer] = useState(false)
    const [multiInputBool, setmultiInputBool] = useState(false)
    const [openEditName, setOpenEditName] = useState(false)
    const [updateState, setUpdateState] = useState(false)
    const [newGroupName, setNewGroupName] = useState("")
    const [openAddParticipant, setOpenAddParticipant] = useState(false)
    const [participants, setParticipants] = useState([])
    const [participantsRole, setParticipantsRole] = useState([])
    const [openActionOptions, setOpenActionOptions] = useState(null);
    const [currentSelectedParticipants, setCurrentSelectedParticipants] = useState()
    const [userRole, setUserRole] = useState()
    const [participantNums, setParticipantNums] = useState(0)

    useEffect(() => {
        let num = 0
        conversationDictionary[conversationId]?.participantsRole?.length > 0 && conversationDictionary[conversationId].participantsRole.map((participantRole) => {
            if (auth?.user?.profile === participantRole?.user?._id) {
                setUserRole(participantRole)
            }

            if (!participantRole?.deleted) {
                num = num + 1
            }
        })
        setParticipantNums(num)
    }, [conversationDictionary[conversationId]])

    const handleCloseActionOptionsMenu = () => {
        setOpenActionOptions(null);
    };

    const openActionOptionsManu = (data) => {
        setOpenActionOptions(data);
        setCurrentSelectedParticipants(data)
    }

    const handleCloseAddParticipant = () => {
        setOpenAddParticipant(false)
    }

    useEffect(() => {
        setOpenDrawer(groupInfoOpen)
    }, [groupInfoOpen])

    const handleDrawerClose = () => {
        setOpenDrawer(false)
        setGroupInfoOpen(false)
    }

    const uploadImg = async (type) => {
        setUpdateState(true)
        setLoadingBool(true)
        let oldGroupDP = conversationDictionary[conversationId]?.groupDP?._id || null

        if (createdFileIds?.length > 0 && conversationDictionary[conversationId]?._id) {
            await updateConversation({
                _id: conversationDictionary[conversationId]?._id,
                groupDP: createdFileIds[0]
            })
                .then((data) => {
                    let updatedConverDic = conversationDictionary
                    updatedConverDic[conversationId].groupDP = data?.groupDP;
                    setConversationDictionary(updatedConverDic)
                    setUpdateState(false)
                    dispatch({ type: "FileUploadReset" });
                    setLoadingBool(false)

                    if (oldGroupDP) {
                        let fileIdsArr = [oldGroupDP]
                        updateDeleteFlagForManyFiles({ fileIds: fileIdsArr })
                            .then((data) => {
                                console.log(data)
                            })
                            .catch((err) => {
                                console.log(err)
                            })
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        dispatch({ type: "FileUploadReset" });
    }

    const editGroupName = () => {
        setNewGroupName(conversationDictionary[conversationId]?.groupName)
        setOpenEditName(true)
    }

    const editGroupNameApiHit = async () => {
        if (conversationDictionary[conversationId]?.groupName !== newGroupName && conversationDictionary[conversationId]?._id) {
            setUpdateState(!updateState)
            setLoadingBool(true)
            if (newGroupName?.length > 2) {
                await updateConversation({
                    _id: conversationDictionary[conversationId]?._id,
                    groupName: newGroupName
                })
                    .then((data) => {
                        let updatedConverDic = conversationDictionary
                        updatedConverDic[conversationId].groupName = newGroupName;

                        setConversationDictionary(updatedConverDic)
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            }
            setUpdateState(!updateState)
        }
        setLoadingBool(false)
        setOpenEditName(false)
    }

    const AddParticipantsApiHit = async () => {
        setUpdateState(false)
        setLoadingBool(true)
        let oldParticipantIds = []
        let oldParticipantWithRoleIds = []
        conversationDictionary[conversationId]?.participantsRole?.length > 0 && conversationDictionary[conversationId].participantsRole.map((userRole) => {
            oldParticipantWithRoleIds.push(userRole?._id)
            oldParticipantIds.push(userRole?.user?._id)
        })

        await addParticipantsWithConv({
            participantsWithRole: participantsRole,
            conversationId: conversationDictionary[conversationId]?._id,
            oldParticipantWithRoleIds,
            oldParticipantIds,
            user: auth?.user?.profile
        })
            .then((data) => {
                let updatedConverDic = conversationDictionary
                updatedConverDic[conversationId] = data?.updatedConversation;
                setConversationDictionary(updatedConverDic)
                setUpdateState(false)

                setParticipants([])
                setParticipantsRole([])

                let num = participantNums + 1
                setParticipantNums(num)
            })
            .catch((err) => {
                console.error(err)
            })
        handleCloseAddParticipant()
        setLoadingBool(false)
    }

    const removeFromGroup = async () => {
        setUpdateState(true)
        setLoadingBool(true)
        await updateAccessRole({
            _id: currentSelectedParticipants?._id,
            deleted: true,
            deletedAt: DateNow
        })
            .then(async (data) => {
                let newParticipantsRoleIds = []
                let newParticipantIds = []
                let oldParticipantsRoleArr = conversationDictionary[conversationId].participantsRole
                oldParticipantsRoleArr?.length > 0 && oldParticipantsRoleArr.map((participantRole) => {
                    if (currentSelectedParticipants?._id !== participantRole?._id) {
                        newParticipantsRoleIds.push(participantRole?._id)
                        newParticipantIds.push(participantRole?.user?._id)
                    }
                })
                await updateConversation({
                    _id: conversationDictionary[conversationId]?._id,
                    participants: newParticipantIds,
                    participantsRole: newParticipantsRoleIds
                })
                    .then(async (data) => {
                        let updatedConverDic = conversationDictionary
                        updatedConverDic[conversationId] = data;
                        setConversationDictionary(updatedConverDic)
                        setUpdateState(false)
                        if (userRole?._id === currentSelectedParticipants?._id) {
                            await getProfileChat()
                            handleDrawerClose()
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                let num = participantNums - 1
                setParticipantNums(num)
            })
            .catch((err) => {
                console.log(err)
            })
        handleCloseActionOptionsMenu()
        setLoadingBool(false)
    }

    const changeRole = async (role) => {
        setUpdateState(true)
        setLoadingBool(true)
        await updateAccessRole({
            _id: currentSelectedParticipants?._id,
            role: role
        })
            .then((data) => {
                const newAccessRole = {
                    ...currentSelectedParticipants,
                    role: role
                }
                let updatedConverDic = conversationDictionary
                let newParticipantsRoleArr = []
                let oldParticipantsRoleArr = updatedConverDic[conversationId].participantsRole
                oldParticipantsRoleArr?.length > 0 && oldParticipantsRoleArr.map((participantRole) => {
                    if (currentSelectedParticipants?._id === participantRole?._id) {
                        newParticipantsRoleArr.push(newAccessRole)
                    } else {
                        newParticipantsRoleArr.push(participantRole)
                    }
                })
                updatedConverDic[conversationId].participantsRole = newParticipantsRoleArr;
                setConversationDictionary(updatedConverDic)
                if (userRole?._id === currentSelectedParticipants?._id) {
                    setUserRole(newAccessRole)
                }
                setLoadingBool(false)
                setUpdateState(false)
            })
            .catch((err) => {
                console.log(err)
            })
        handleCloseActionOptionsMenu()
    }

    const leaveGroup = async () => {
        setUpdateState(true)
        setLoadingBool(true)
        await updateAccessRole({
            _id: userRole?._id,
            deleted: true,
            deletedAt: DateNow
        })
            .then(async (data) => {
                let newParticipantsRoleIds = []
                let newParticipantIds = []
                let oldParticipantsRoleArr = conversationDictionary[conversationId].participantsRole
                oldParticipantsRoleArr?.length > 0 && oldParticipantsRoleArr.map((participantRole) => {
                    if (userRole?._id !== participantRole?._id) {
                        newParticipantsRoleIds.push(participantRole?._id)
                        newParticipantIds.push(participantRole?.user?._id)
                    }
                })
                await updateConversation({
                    _id: conversationDictionary[conversationId]?._id,
                    participants: newParticipantIds,
                    participantsRole: newParticipantsRoleIds
                })
                    .then(async (data) => {
                        let updatedConverDic = conversationDictionary
                        updatedConverDic[conversationId] = data;
                        setConversationDictionary(updatedConverDic)
                        await getProfileChat()
                        setUpdateState(false)
                        handleDrawerClose()
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            })
            .catch((err) => {
                console.log(err)
            })
        setLoadingBool(false)
    }


    //remove user
    const removeMsgWithUser = (id) => {
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
    const updateMsgUserWithRole = (value, index) => {
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
    const addNewMsgAccessUser = (newAccessRoleObj) => {
        let allParticipants = []

        conversationDictionary[conversationId]?.participants.length > 0 && conversationDictionary[conversationId].participants.map((user) => {
            allParticipants.push(user?._id)
        })

        let isCurrentUserExist = allParticipants.includes(newAccessRoleObj?.user?._id)

        if (!isCurrentUserExist) {

            const accessableUserWithRoleObj = {
                user: newAccessRoleObj?.user,
                role: newAccessRoleObj?.role
            }
            let newAccessableUsersWithRoleArr = [...participantsRole, accessableUserWithRoleObj]
            setParticipantsRole(newAccessableUsersWithRoleArr);
        }
    }


    console.log(conversationDictionary[conversationId])

    return (
        <Drawer
            variant="temporary"
            anchor={"right"}
            open={openDrawer}
            onClose={handleDrawerClose}
            classes={{ paper: classes.drawerPaper }}
            ModalProps={{ keepMounted: true }}
        >
            <div className={classes.topBar} >
                <CloseIcon
                    style={{ marginLeft: "15px", marginRight: "10px", cursor: "pointer" }}
                    onClick={() => { handleDrawerClose() }}
                />
                group info
            </div>
            <div className={classes.imgNameCont} >
                <div className={classes.imgStyle} >
                    <img
                        src={conversationDictionary[conversationId]?.groupDP?.url}
                        alt="groupPic"
                        style={{ width: "250px", height: "200px" }}
                    />
                </div>
                <FileUploadButton
                    parentType='Message'
                    used={false}
                    cameraIcon={true}
                    parentId={null}
                    isCover={true}
                    uploadImg={uploadImg}
                    onlyCameraStyle={classes.cameraStyle}
                />
                <div className={classes.groupNameEditCont} >
                    {openEditName ? (<>
                        <TextField
                            id="outlined-basic"
                            size="small"
                            label="Name"
                            variant="outlined"
                            style={{ width: "70%" }}
                            value={newGroupName}
                            onChange={(e) => { setNewGroupName(e.target.value) }}
                        />
                        <IconButton
                            onClick={() => { editGroupNameApiHit() }}
                        >
                            <DoneIcon
                                style={{ color: theme.palette.primary.main }}
                            />
                        </IconButton>
                    </>) : (<>
                        <div className={classes.groupNameCont} >
                            {conversationDictionary[conversationId]?.groupName}
                        </div>
                        <IconButton>
                            <EditIcon
                                onClick={() => { editGroupName() }}
                            />
                        </IconButton>
                    </>)}
                </div>
                <Typography>Group - {participantNums} Participants</Typography>
            </div>
            <div className={classes.ParticipantsCont} >
                {userRole?.role === 'Admin' && (
                    <div
                        className={classes.addParticipantCont}
                        onClick={() => { setOpenAddParticipant(true) }}
                    >
                        <PersonAddIcon
                            style={{
                                fontSize: "45px",
                                borderRadius: "50%",
                                backgroundColor: "#ffffff",
                                padding: "6px",
                                marginRight: "10px",
                                color: theme.palette.primary.main
                            }}
                        /> Add participant
                    </div>
                )}
                <Dialog
                    scroll={'paper'}
                    onClose={handleCloseAddParticipant}
                    aria-labelledby="scroll-dialog-title"
                    aria-describedby="scroll-dialog-description"
                    open={openAddParticipant}
                    className={classes.dialogStyle}
                >
                    <DialogTitle
                        id="customized-dialog-title"
                        onClose={handleCloseAddParticipant}
                        style={{ padding: "8px 24px" }}
                    >
                        Select Participant(s)
                    </DialogTitle>
                    <DialogContent dividers={true} className={classes.mainContStyle} >
                        <div className={classes.contStyle} >
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
                                removeUserRole={removeMsgWithUser}
                                updateRoleOfUserRole={updateMsgUserWithRole}
                                addUserRole={addNewMsgAccessUser}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions
                        style={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Button autoFocus onClick={handleCloseAddParticipant} color="primary">
                            Cancel
                        </Button>
                        <Button autoFocus onClick={() => { AddParticipantsApiHit() }} color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>
                <div
                    className={classes.addParticipantCont}
                    onClick={() => { leaveGroup() }}
                >
                    <ExitToAppIcon
                        style={{
                            fontSize: "45px",
                            borderRadius: "50%",
                            backgroundColor: "#ffffff",
                            padding: "6px",
                            marginRight: "10px",
                            color: "red"
                        }}
                    /> Exit Group
                </div>
                {conversationDictionary[conversationId]?.participantsRole.map((participant) => (
                    <div className={classes.participantRow} >
                        <div className={classes.participantPhotoNameCont} >
                            <Avatar
                                src={participant?.user?.parent?.displayPicture?.thumbUrl}
                            />
                            <Typography style={{ marginLeft: "10px" }} >
                                <LessText
                                    limit={12}
                                    string={participant?.user?.parent?.displayName || "mailId Not Avaliable"}
                                />
                            </Typography>
                        </div>
                        {participant?.role === 'Admin' && (
                            <div
                                style={{
                                    backgroundColor: "#b4f0b4",
                                    padding: "2px 5px",
                                    borderRadius: "9px",
                                    fontSize: "12px"
                                }}
                            >Group Admin</div>
                        )}
                        {userRole?.role === 'Admin' && (
                            <IconButton
                                onClick={() => { openActionOptionsManu(participant) }}
                            >
                                <MoreVertIcon />
                            </IconButton>
                        )}
                    </div>
                ))}
                <Menu
                    id="simple-menu"
                    anchorEl={openActionOptions}
                    keepMounted
                    open={Boolean(openActionOptions)}
                    onClose={handleCloseActionOptionsMenu}
                    PaperProps={{
                        style: {
                            width: '230px',
                        }
                    }}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                >
                    <MenuItem
                        onClick={() => { removeFromGroup() }}
                    >Remove</MenuItem>
                    {currentSelectedParticipants?.role === "Admin" && (
                        <MenuItem
                            onClick={() => { changeRole("User") }}
                        >Dismiss as admin</MenuItem>
                    )}
                    {currentSelectedParticipants?.role === "User" && (
                        <MenuItem
                            onClick={() => { changeRole("Admin") }}
                        >Make group admin</MenuItem>
                    )}
                </Menu>
            </div>
        </Drawer>
    );
};

export default GroupInfoDrawer;
