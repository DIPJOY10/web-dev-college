import React, { useEffect, useState } from 'react';
import UserMessageItem from './UserMessageItem';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from "@material-ui/core/Avatar";
import CircularProgress from '@material-ui/core/CircularProgress';
import { Typography, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
  },
  userCont: {
    display: 'flex',
    alignItems: 'center',
    padding: "10px",
    borderBottom: "1px solid #E1E2E5",
    cursor: "pointer",
  },
  infoCont: {
    marginLeft: "10px"
  },
  label: {
    color: theme.palette.primary.main,
    fontSize: "17px",
    fontWeight: "500",
    margin: "10px 15px"
  },
  circularProgressCont: {
    width: "100%",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }
}));

const UserMessageList = (props) => {
  const classes = useStyles();
  const {
    convIds, conversationDictionary, profile, searchedUsers,
    selectedConversation, setSelectedConversation, handleDrawerToggle,
    searchText, setSelectedUsers, userSearchLoading
  } = props
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div className={classes.root}>
      {convIds.map((conversationId) => {
        return <UserMessageItem
          key={conversationId}
          profile={profile}
          conversationId={conversationId}
          conversationDictionary={conversationDictionary}
          selectedConversation={selectedConversation}
          setSelectedConversation={setSelectedConversation}
          handleDrawerToggle={handleDrawerToggle}
          setSelectedUsers={setSelectedUsers}
        />;
      })}

      {userSearchLoading ? (<div className={classes.circularProgressCont} >
        <CircularProgress />
      </div>) : (<>
        {searchedUsers.length > 0 && searchText.length > 1 ? (
          <>
            <p className={classes.label} >Start a new conversation</p>
            <>
              {searchedUsers.map((user) => (
                <div className={classes.userCont} onClick={() => {
                  setSelectedUsers(user)
                  if (isMobile) {
                    handleDrawerToggle()
                  }
                }} >
                  <Avatar src={user?.displayPicture?.thumbUrl} />
                  <div className={classes.infoCont} >
                    <p style={{ fontSize: "16px", fontWeight: "500" }} >{user?.displayName}</p>
                    {/* <p style={{ fontSize: "13px" }} >{user?.email}</p> */}
                  </div>
                </div>
              ))}
            </>
          </>
        ) : null}
      </>)}
    </div>
  );
};

export default UserMessageList;
