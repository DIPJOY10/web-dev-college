import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Link, useParams, useHistory } from 'react-router-dom';
import Api from '../../helpers/Api';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Typography, useMediaQuery } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import UserMessageList from './UserMessageList';
import arrayToReducer from '../../helpers/arrayToReducer';
import Appbar from './AppBar';
import BottomBar from './BottomBar';
import MessageDrawer from './MessageDrawer';
import useChatHook from '../../helpers/socket/useChatHook';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from "@material-ui/core/Drawer";
import msgEmpty1 from "../../Assets/chat.svg"
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import IconButton from '@material-ui/core/IconButton';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  updateDeleteFlagForManyFiles,
  updateDeleteFlagForSingleFiles
} from './apiCall';
import CreateGroupDialog from './Create.Group.Dialog';
import { getUserByName } from '../finance/transaction/api';
import CreateConversation from './CreateConversation.js'



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: theme.drawer.width,
    [theme.breakpoints.only('sm')]: {
      left: theme.drawer.smWidth,
    },
    [theme.breakpoints.only('xs')]: {
      left: 0,
    },
    width: `100%`,
  },
  msgCont: {
    width: 'calc(100vw - 7rem)',
    heigth: "100%",
    display: "flex",
    [theme.breakpoints.down('sm')]: {
      width: 'calc(100vw - 100px)',
    },
    [theme.breakpoints.down('xs')]: {
      width: "100vw",
    },
  },
  msgContacts: {
    width: "37%",
    heigth: "100%",
    backgroundColor: "#F4F5F6",
    color: "black",
    borderRight: "1px solid #E1E2E5",
    [theme.breakpoints.down('sm')]: {
      display: "none"
    },
  },
  msgContactsForDrawer: {
    [theme.breakpoints.down('sm')]: {
      width: "calc(100vw - 100px)",
      marginLeft: "100px",
      height: "100vh",
      backgroundColor: "white",
      borderRight: "1px solid #E1E2E5",
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 62px)`,
      width: "100vw",
      marginLeft: "0px",
    },
  },
  menuStyle: {
    display: "none",
    cursor: "pointer",
    [theme.breakpoints.down('sm')]: {
      display: "block",
      marginRight: "10px",
    },
    [theme.breakpoints.down('xs')]: {
      display: "none",
    },
  },
  msgChat: {
    width: "63%",
    heigth: "100%",
    backgroundColor: "white",
    [theme.breakpoints.down('sm')]: {
      width: "100%",
      height: `calc(100vh - 70px)`,
    },
    [theme.breakpoints.down('xs')]: {
      width: "100%",
      height: `calc(100vh - 100px)`,
    },
  },
  msgContactsBar: {
    padding: "4px 15px",
    backgroundColor: "#FFFFFF",
    borderRight: "1px solid #E1E2E5",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "black",
    alignItems: "center",
  },
  allMsgContBar: {
    height: "57px",
    position: "relative",
    padding: "7px 15px",
    borderBottom: "1px solid #E1E2E5",
    backgroundColor: "#62B9ED",
    borderRight: "1px solid #E1E2E5",
    display: "flex",
    color: "#F7F7F6",
    alignItems: "center",
  },
  searchingBox: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px 0px",
    backgroundColor: "#ffffff",
    borderBottom: "1px solid #E1E2E5",
    marginBottom: "3px"
  },
  searchInput: {
    width: "95%",
    fontSize: "18px"
  },
  msgContactCont: {
    height: "calc(100vh - 134px)",
    overflowY: "auto",
  },
  avatarSty: {
    height: "35px",
    width: "35px"
  },
  emptyMsgBox: {
    boxShadow: '0 1px 1px 1px #eeeeee',
    paddingTop: '2rem',
    paddingBottom: '5rem',
    overflow: 'auto',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: `calc(100vh - 118px)`,
    [theme.breakpoints.down('sm')]: {
      height: `calc(100vh - 138px)`,
    },
    [theme.breakpoints.down('xs')]: {
      height: `calc(100vh - 180px)`,
    },
  },
  msgEmptyStyle: {
    width: '50%',
    heigth: "50%"
  },
  loaderCont: {
    position: 'fixed',
    top: "0px",
    right: "0px",
    width: "100vw",
    height: "100vh",
    zIndex: "99999 !important",
    paddingLeft: "100px",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    [theme.breakpoints.down('xs')]: {
      paddingLeft: "0px",
    },
  },

  iconButtonStyle: {
    marginLeft: "-15px",
    marginRight: "5px"
  }
}));

const Chat = (props) => {
  const classes = useStyles();
  const { profileId: profileIdParam, convId } = useParams();
  const auth = useSelector((state) => state.auth);
  const { createdFileIds } = useSelector((state) => state.file);
  const { user } = auth;
  const profileId = profileIdParam ? profileIdParam : user?.profile

  const oldConvId = convId ? convId : null
  const history = useHistory();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isXSMobile = useMediaQuery(theme.breakpoints.down('xs'));

  const [profile, setProfile] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(true);
  const [selectedConversation, setSelectedConversation] = useState(oldConvId)
  const [nameIdsArr, setNameIdsArr] = useState([])
  const [fileUpload, setFileUpload] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [loadingBool, setLoadingBool] = useState(false);
  const [unChnagedConvIds, setUnChnagedConvIds] = useState([])
  const [searchedUsers, setSearchedUsers] = useState([])
  const [openGroupCreate, setOpenGroupCreate] = useState(false)
  const [selectedNewUsers, setSelectedUsers] = useState(null)
  const [userSearchLoading, setUserSearchLoading] = useState(false)


  const {
    convIds, setConvIds,
    convDict, setConvDict,
    msgMap, setMsgMap,
    msgDict, setMsgDict,
    addMsgHelper
  } = useChatHook(profileId)

  var activeConversation = convDict[selectedConversation]

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
    setConvIds(unChnagedConvIds)
    setSearchText("")
  }

  const getProfileChat = async () => {
    const res = await Api.post('chat/findProfileChat', {
      profileId
    })
    const data = res?.data;

    if (data) {

      if (data?.length > 0) {
        const {
          idArr, newDict
        } = arrayToReducer(data)
        setSelectedConversation(idArr[0])
        setConvIds(idArr)
        setConvDict(newDict)

        var newMsgMap = {}
        var newMsgDict = {}
        data.map(conv => {
          var convId = conv?._id;
          var topMessage = conv?.topMessage
          const msgId = topMessage?._id
          newMsgDict[msgId] = topMessage
          newMsgMap[convId] = [msgId]
        })
        setMsgDict(newMsgDict)
        setMsgMap(newMsgMap)
      }
    }
  }



  const getProfile = async () => {
    const res = await Api.post('profile/getProfile', {
      profileId
    })
    let data = res.data
    if (data) {
      setProfile(data)
    }
  }

  const createNameAndIdsArr = () => {
    let idNameArr = []
    if (convIds.length > 0) {
      convIds.map((id) => {
        const conver = convDict[id];
        if (conver && conver.participants) {
          if (conver?.type === 'Group') {
            const newObj = {
              id,
              displayName: conver?.groupName
            }
            idNameArr.push(newObj)
          } else {
            const participants = conver.participants;
            let otherUsers = participants.filter((participant) => (participant._id !== profileId));
            if (otherUsers.length > 0) {
              let displayName = otherUsers[0]?.parent?.displayName;
              const newObj = {
                id,
                displayName
              }
              idNameArr.push(newObj)
            }
          }
        }
      })
    }
    setNameIdsArr(idNameArr)
  }


  const onSearchInputChange = async (value) => {
    setUserSearchLoading(true)
    setSearchText(value)
    let filteredContacts = []

    if (value.length > 0) {
      nameIdsArr.map((user) => {
        let name = user?.displayName
        const patt = new RegExp(value, "i");
        const res = patt.test(name);
        if (res) {
          filteredContacts.push(user?.id)
        }
      });
      setConvIds(filteredContacts)
    } else {
      setConvIds(unChnagedConvIds)
    }


    if (value.length > 1) {
      await getUserByName({ name: value })
        .then((users) => {
          let userIdArrays = []

          filteredContacts.map((contactId) => {
            const conversation = convDict[contactId]
            const participants = conversation.participants;
            const otherUsers = participants.filter((participant) => (participant._id !== profileId));
            let primaryUser
            if (otherUsers.length > 0) {
              primaryUser = otherUsers[0];
            }
            userIdArrays.push(primaryUser?.parent?._id)
          })

          let filteredNewUser = []

          users.map((user) => {
            if (!userIdArrays.includes(user?._id)) {
              filteredNewUser.push(user)
            }
          })

          if (filteredNewUser.length > 0) {
            setSearchedUsers(filteredNewUser)
          } else {
            setSearchedUsers([])
          }
        })
        .catch((err) => {
          console.log(err)
        })
    } else {
      setSearchedUsers([])
    }

    setUserSearchLoading(false)
  }



  const removeImgFromReducer = () => {
    dispatch({ type: "FileUploadReset" });
  }
  const removeImgFromReducerAndDelete = async () => {
    updateDeleteFlagForManyFiles({ fileIds: createdFileIds })
      .then((data) => {
        console.log(data)
      })
      .catch((err) => {
        console.log(err)
      })
    dispatch({ type: "FileUploadReset" });
  }

  useEffect(() => {
    getProfile()
  }, []);

  useEffect(() => {
    getProfileChat()
  }, [])

  useEffect(() => {
    createNameAndIdsArr()
    setUnChnagedConvIds(convIds)
  }, [convDict, msgMap, msgDict])


  return (
    <div className={classes.root}>
      <div className={classes.msgCont} >
        <div className={classes.msgContacts} >
          <div className={classes.msgContactsBar} >
            <div style={{ display: 'flex', alignItems: 'center' }} >
              <Avatar
                alt="userPic"
                size={"large"}
                src={profile?.parent?.displayPicture?.thumbUrl}
                className={classes.avatarSty}
              />
              <Typography style={{ marginLeft: "12px", fontSize: "16px", fontWeight: "550" }} >Messaging</Typography>
            </div>
            <IconButton>
              <GroupAddIcon
                style={{ color: "black" }}
                onClick={() => { setOpenGroupCreate(true) }}
              />
            </IconButton>
          </div>
          <div className={classes.searchingBox} >
            <TextField
              placeholder={"Search"}
              id="outlined-basic"
              variant="outlined"
              className={classes.searchInput}
              size={"small"}
              value={searchText}
              onChange={(e) => { onSearchInputChange(e.target.value) }}
            />
          </div>
          <div className={classes.msgContactCont} >
            <UserMessageList
              convIds={convIds}
              conversationDictionary={convDict}
              profile={profile}
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              searchedUsers={searchedUsers}
              searchText={searchText}
              setSelectedUsers={setSelectedUsers}
              userSearchLoading={userSearchLoading}
            />
          </div>
        </div>
        {isMobile ? (
          <Drawer
            variant="temporary"
            anchor={"left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true
            }}
          >
            <div className={classes.msgContactsForDrawer} >
              <div className={classes.msgContactsBar} >
                <div style={{ display: 'flex', alignItems: 'center' }} >
                  {isXSMobile && (
                    <IconButton
                      className={classes.iconButtonStyle}
                      onClick={() => {
                        history.goBack()
                      }}
                    >
                      <KeyboardBackspaceIcon style={{ fontSize: 30, color: "white" }} />
                    </IconButton>
                  )}
                  <Avatar
                    alt="userPic"
                    size={"large"}
                    src={profile?.parent?.displayPicture?.thumbUrl}
                    className={classes.avatarSty}
                  />
                  <Typography style={{ marginLeft: "12px", fontSize: "16px", fontWeight: "550" }} >Messaging</Typography>
                </div>
                <IconButton>
                  <GroupAddIcon
                    style={{ color: "#ffffff" }}
                    onClick={() => { setOpenGroupCreate(true) }}
                  />
                </IconButton>
              </div>
              <div className={classes.searchingBox} >
                <TextField
                  placeholder={"Search"}
                  id="outlined-basic"
                  variant="outlined"
                  className={classes.searchInput}
                  size={"small"}
                  value={searchText}
                  onChange={(e) => { onSearchInputChange(e.target.value) }}
                />
              </div>
              <div className={classes.msgContactCont} >
                {unChnagedConvIds.length > 0 || searchedUsers.length > 0 || !userSearchLoading ? (
                  <UserMessageList
                    convIds={convIds}
                    conversationDictionary={convDict}
                    profile={profile}
                    selectedConversation={selectedConversation}
                    setSelectedConversation={setSelectedConversation}
                    handleDrawerToggle={handleDrawerToggle}
                    searchedUsers={searchedUsers}
                    searchText={searchText}
                    setSelectedUsers={setSelectedUsers}
                    userSearchLoading={userSearchLoading}
                  />
                ) :
                  (<div className={classes.emptyMsgBox} >
                    <img src={msgEmpty1} className={classes.msgEmptyStyle} />
                    <Typography
                      style={{
                        fontSize: "20px",
                        fontWeight: "550",
                        marginBottom: "20px"
                      }}
                    >It's nice to chat with someone</Typography>
                    <Typography
                      style={{
                        width: "216px",
                        fontSize: "14px",
                        textAlign: "center",
                      }}
                    >Pick a person from our network and start your conversation</Typography>
                  </div>
                  )}
              </div>
            </div>
          </Drawer>
        ) : null}
        <CreateGroupDialog
          setOpenGroupCreate={setOpenGroupCreate}
          openGroupCreate={openGroupCreate}
          getProfileChat={getProfileChat}
          setLoadingBool={setLoadingBool}
        />
        <div className={classes.msgChat} >
          {selectedNewUsers ? null : (
            <div className={classes.allMsgContBar} >
              <MenuIcon
                onClick={() => { setMobileOpen(true); }}
                className={classes.menuStyle}
              />
              {isXSMobile && (
                <IconButton
                  className={classes.iconButtonStyle}
                  onClick={() => { setMobileOpen(true); }}
                >
                  <KeyboardBackspaceIcon style={{ fontSize: 30, color: "white" }} />
                </IconButton>
              )}
              <Appbar
                conversationId={selectedConversation}
                conversationDictionary={convDict}
                setConversationDictionary={setConvDict}
                profile={profile}
                getProfileChat={getProfileChat}
                loadingBool={loadingBool}
                setLoadingBool={setLoadingBool}
              />
            </div>)}
          {selectedNewUsers ? (<>
            <CreateConversation
              selectedNewUsers={selectedNewUsers}
              setSelectedUsers={setSelectedUsers}
              getProfileChat={getProfileChat}
              setSelectedConversation={setSelectedConversation}
              handleDrawerToggle={handleDrawerToggle}
              setLoadingBool={setLoadingBool}
              setSearchedUsers={setSearchedUsers}
              setSearchText={setSearchText}
            />
          </>) : (<>
            {unChnagedConvIds.length > 0 ? (
              <MessageDrawer
                conversation={activeConversation}
                messageMap={msgMap}
                messageDictionary={msgDict}
                addMsgHelper={addMsgHelper}
                fileUpload={fileUpload}
                setFileUpload={setFileUpload}
                removeImgFromReducerAndDelete={removeImgFromReducerAndDelete}
              />
            ) : (<div className={classes.emptyMsgBox} >
              <img src={msgEmpty1} className={classes.msgEmptyStyle} />
              <Typography
                style={{
                  fontSize: "20px",
                  fontWeight: "550",
                  marginBottom: "20px"
                }}
              >It's nice to chat with someone</Typography>
              <Typography
                style={{
                  width: "216px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >Pick a person from the network and start your conversation</Typography>
            </div>)}
            <BottomBar
              conversationId={selectedConversation}
              profile={profile}
              addMsgHelper={addMsgHelper}
              setFileUpload={setFileUpload}
              removeImgFromReducer={removeImgFromReducer}
            />
          </>)}
        </div>
      </div>
      {loadingBool &&
        <div className={classes.loaderCont} >
          <CircularProgress
            size={60}
            thickness={3}
            style={{ color: 'rgb(92, 144, 242)' }}
          />
        </div>}
    </div>
  );
};

export default Chat;
