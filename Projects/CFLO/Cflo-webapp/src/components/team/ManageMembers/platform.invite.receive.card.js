import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory, Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Api from "../../../helpers/Api";
import cx from "clsx";
import teamUtils from "../../team/team.utils";
import AvatarLocal from "../../profile/avatar";
import { Button } from "@material-ui/core";
import BlockIcon from '@material-ui/icons/Block';
import DoneIcon from '@material-ui/icons/Done';
import LessText from "../../styled/CommonComponents/LessText";

const useStyle = makeStyles((theme) => ({
  root: {
    position: 'relative',
    display: "flex",
    flexDirection: "Column",
    padding: "10px",
    width: "400px",
    height: "115px",
    marginBottom: "10px",
    cursor: "pointer",
    boxShadow: "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    [theme.breakpoints.down('xs')]: {
      width: "320px",
    },
  },
  avatar: {
    position: "absolute",
    top: "22px",
    right: "16px",
    width: "30px",
    height: "30px",
  },
  button: {
    padding: '2px 5px',
    fontSize: '13px',
    margin: "1vh 0 0 0",
    borderRadius: '2vw',
    [theme.breakpoints.down('xs')]: {
      padding: '.5vh 2vw',
      borderRadius: '5vw',
    }
  },
  buttons: {
    display: 'flex',
  },
  reject: {
    marginLeft: '1vw', [theme.breakpoints.down('xs')]: {
      marginLeft: '2vw'
    }
  }
}));

function PlatformInviteRecieveCard({ invite, setInvites, invites, addCreatedOne }) {
  const classes = useStyle();
  const history = useHistory();
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const theme = useTheme();
  const profile = user?.profile;

  const { handleTeams } = teamUtils;

  console.log(invite);

  async function handleAccept() {
    const newlyAddedTeam = await Api.post("invite/accept", {
      invite: invite._id,
    });

    handleTeams([newlyAddedTeam], state, dispatch);

    addCreatedOne(newlyAddedTeam)

    let filteredInvites = invites.filter((el) => el._id !== invite._id)

    dispatch({
      type: "AddTeam",
      payload: {
        invitations: filteredInvites,
      },
    });

    setInvites(filteredInvites);
  }

  async function handleReject() {
    const reject = await Api.post("invite/reject", {
      invite: invite._id,
    });

    let filteredInvites = invites.filter((el) => el._id !== invite._id)

    dispatch({
      type: "AddTeam",
      payload: {
        invitations: filteredInvites,
      },
    });

    setInvites(filteredInvites);
  }

  return (
    <Paper className={classes.root}>
      <div>
        <Typography style={{ fontSize: "15px", fontWeight: "500" }} >
          <LessText
            limit={20}
            string={invite?.team?.parent?.displayName}
          />
        </Typography>
        <Typography style={{ fontSize: "13px" }} >
          <LessText
            limit={25}
            string={`From ${invite?.invitedById?.parent?.displayName}`}
          />
        </Typography>
        <Typography style={{ fontSize: "12px" }} >
          <LessText
            limit={25}
            string={`Role - ${invite?.role}`}
          />
        </Typography>
      </div>
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}  >
        <div></div>
        <div className={classes.buttons}>
          <Button
            onClick={handleAccept}
            color='primary'
            variant="contained"
            className={classes.button}
            startIcon={<DoneIcon />}
          >
            Accept
          </Button>
          <Button
            onClick={handleReject}
            variant="contained"
            color="secondary"
            className={cx(classes.button, classes.reject)}
            startIcon={<BlockIcon />}
          >
            Reject
          </Button>
        </div>
      </div>
      <AvatarLocal
        className={classes.avatar}
        src={invite?.invitedById?.parent}
      />
    </Paper>
  );
}

export default PlatformInviteRecieveCard;
