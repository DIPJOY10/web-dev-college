import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import { useHistory } from "react-router-dom";
import CreateOrgDialog from "./create.org.dialog";
import ProfileBasic from "../styled/Profile/basic";
import { updateOrg } from "./organization.utils";
import { updateUser } from "../profile/profile.utils";
import { setOrgs } from "./organization.utils";
import CreateButton from "../styled/actionBtns/create.btn";
import TeamCard from "../team/team.card";
import { Button, Paper, useMediaQuery } from "@material-ui/core";
import Menubar from "../styled/menubar";
import AllOrg from "./all.organization";
import SentInvites from "./org.sent.invites";
import ReceivedInvites from "./org.received.invites";
import StyledMenubar from "../styled/styled.menubar";

const TABS = {
  ALL: 0,
  SENT_INVITES: 1,
  RECEIVED_INVITES: 2,
};

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    top: 0,
    width: `calc(100%)`,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 0,
    },
    overflow: "auto",
  },
  createButtonText: {
    marginLeft: "0.5rem",
    color: theme.palette.primary.main,
  },

  gridStyle: {
    flex: 1,
    flexDirection: "column",
  },

  topBarDivider: {
    width: "50%",
    marginTop: "0.5rem",
    marginBottom: "1rem",
  },

  createDivStyle: {
    marginLeft: "2rem",
    marginTop: "0.2rem",
  },

  rowReverse: {
    display: "flex",
    flexDirection: "row-reverse",
  },

  createButtonText: {
    marginRight: "0.5rem",
  },
}));

function RenderComponent({ tabIndex }) {
  switch (tabIndex) {
    case TABS.ALL:
      return <>
        <ReceivedInvites />
        <AllOrg />
      </>;
    case TABS.SENT_INVITES:
      return <SentInvites />;
    case TABS.RECEIVED_INVITES:
      return <ReceivedInvites />;
    default:
      return <div />;
  }
}

const Organizations = (props) => {
  const classes = useStyles();
  const [openOrgCreateDialog, setOpenOrgCreateDialog] = useState(false);
  const [tabIndex, setTabIndex] = useState(TABS.ALL);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user, organizationIds, organizationDictionary } = auth;
  const history = useHistory();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  // console.log(organizationIds, organizationDictionary);
  const walletId = user.wallet;
  // const pathUrl = new URLSearchParams(document.location.search.substring(1)).get('path');

  const updateOrgApi = (updateObject) => {
    updateOrg(updateObject, auth, dispatch);
  };

  const updateUserApi = (updateObject) => {
    updateUser(updateObject, auth, dispatch);
  };

  return (
    <Paper className={classes.root}>
      {!isMobile ? <StyledMenubar
        navState={tabIndex}
        setNav={setTabIndex}
        items={[
          {
            text: "Organizations",
            navText: TABS.ALL,
          },
          {
            text: "Invites",
            navText: TABS.SENT_INVITES,
          }
        ]}
      /> : null}
      
      <RenderComponent tabIndex={tabIndex} />
    </Paper>
  );
};

export default Organizations;
