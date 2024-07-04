import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import AddIcon from "@material-ui/icons/Add";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Grid from "@material-ui/core/Grid";
import { useHistory, useParams } from "react-router-dom";

// import WalletView from '../transaction/wallet.view'
import CreateOrgDialog from "../organization/create.org.dialog";
import Divider from "@material-ui/core/Divider";
import ProfileBasic from "../styled/Profile/basic";
import { updateOrg } from "../organization/organization.utils";
import { updateUser } from "../profile/profile.utils";
import EntityView from "../profile/entity.view";
import { setOrgs } from "../organization/organization.utils";
import TeamCard from "../team/team.card";
import Organizations from "../organization/organizations";
import UserProfileTopView from "../profile/UserProfileTopView";
import AppPanel from "../brandApp/brand.app.panel";
import ProfileData from "../profile/cards";
import Api from "../../helpers/Api";

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

  createButtonText: {
    marginLeft: "0.5rem",
    color: theme.palette.primary.main,
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

const Account = (props) => {
  const classes = useStyles();
  const [tab, setTab] = useState("Profile");
  const [openOrgCreateDialog, setOpenOrgCreateDialog] = useState(false);

  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const userProfileId = user?.profile;
  const history = useHistory();
  // console.log(organizationIds, organizationDictionary);
  const walletId = user.wallet;

  // const userProfile = useMemo(async () => {
  //   // const userProfileRes = await Api
  // }, [userProfileId]);

  // useEffect();

  return (
    <div className={classes.root}>
      <UserProfileTopView
        profile={{
          _id: user.profile,
          parent: user,
          parentModelName: "User",
        }}
        onSearch={false}
        isOwnProfile={true}
      />

      {/* <ProfileData profileId={user?.profile} isAdmin={true} type={'User'} /> */}

      {/* <AppPanel profileId={user?.profile} /> */}

      {/* <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="prg-content"
        >
          <h3 className={classes.heading}>Organizations</h3>
        </AccordionSummary>
        <AccordionDetails>
          <Organizations />
        </AccordionDetails>
      </Accordion> */}

      {/* {tab === 'Settings' ? (
        <>
          <ProfileBasic
            entity={user}
            updateApi={(entNew) => {
              switch (user.model) {
                case 'Organization':
                  updateOrgApi(entNew);
                  break;

                case 'User':
                  updateUserApi(entNew);
                  break;

                default:
                  break;
              }

              dispatch({
                type: 'AddAuth',
                payload: {
                  user: {
                    ...user,
                    ...entNew,
                  },
                },
              });
            }}
            fileUpdateApi={(file) => {
              const entNew = {
                _id: user._id,
                displayPicture: file._id,
              };

              switch (user.model) {
                case 'Organization':
                  updateOrgApi(entNew);
                  break;

                case 'User':
                  updateUserApi(entNew);
                  break;

                default:
                  break;
              }

              dispatch({
                type: 'AddAuth',
                payload: {
                  user: {
                    ...user,
                    displayPicture: {
                      _id: file._id,
                      url: file.url,
                      thumbUrl: file.thumbUrl,
                    },
                  },
                },
              });
            }}
          />
        </>
      ) : null} */}
    </div>
  );
};

export default Account;
