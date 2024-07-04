import React, { useEffect, useState } from 'react';
import UserMessageItem from './UserMessageItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Avatar from "@material-ui/core/Avatar";
import CancelScheduleSendIcon from '@material-ui/icons/CancelScheduleSend';
import SendIcon from '@material-ui/icons/Send';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import { initConversation } from './apiCall';



const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: "45%"
    },
    mainCont: {
        width: "85%",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    btnCont: {
        width: "100%",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: "20px"
    },
    title: {
        marginBottom: "30px",
        textAlign: "center",
        color: theme.palette.primary.main,
        fontSize: "25px"
    },
    avtStyle: {
        width: "80px",
        height: "80px",
    }
}));

const CreateConversation = (props) => {
    const classes = useStyles();
    const {
        selectedNewUsers, setSelectedUsers, getProfileChat, setSearchedUsers,
        setSearchText, handleDrawerToggle, setSelectedConversation, setLoadingBool
    } = props
    const auth = useSelector((state) => state.auth);
    const [textMsg, setTextMsg] = useState("")


    const createNewConv = async () => {
        setLoadingBool(true)

        let senderProfileId = auth?.user?.profile
        let receiverProfileId = selectedNewUsers?.profile?._id
        if (senderProfileId && receiverProfileId) {

            const convObj = {
                participants: [senderProfileId, receiverProfileId],
                participantsRole: [],
                user: auth?.user?.profile,
                type: "Private",
                text: textMsg,
                groupDP: null,
                groupName: null
            }

            await initConversation(convObj)
                .then(async (data) => {
                    let createdConvId = data?.data?.conversation?._id
                    await getProfileChat()

                    setSelectedConversation(createdConvId);
                    setSelectedUsers(null)
                    setSearchedUsers([])
                    setSearchText("")
                })
                .catch((err) => {
                    console.log(err)
                })
        }
        setLoadingBool(false)
    }


    return (
        <div className={classes.root}>
            <div className={classes.mainCont} >
                <p className={classes.title} >Start New Conversation</p>
                <Avatar
                    className={classes.avtStyle}
                    src={selectedNewUsers?.displayPicture?.url} />
                <p
                    style={{
                        fontSize: "15px",
                        fontWeight: "500",
                        marginTop: "15px"
                    }}
                >{selectedNewUsers?.displayName}</p>
                <TextField
                    id="outlined-multiline-static"
                    label="Message"
                    multiline
                    rows={3}
                    variant="outlined"
                    style={{ width: "100%", marginTop: "40px" }}
                    value={textMsg}
                    onChange={(e) => { setTextMsg(e.target.value) }}
                />
                <div className={classes.btnCont} >
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<CancelScheduleSendIcon />}
                        onClick={() => { setSelectedUsers(null) }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        endIcon={<SendIcon />}
                        onClick={() => { createNewConv() }}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateConversation;
