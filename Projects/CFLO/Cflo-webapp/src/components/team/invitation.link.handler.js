import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Api from "../../helpers/Api";
import { useMediaQuery } from "@material-ui/core";
import EmailIcon from "@material-ui/icons/Email";
import LogoPrimary from "../../Assets/LogoPrimary.svg";
import cx from "clsx";

const useStyles = makeStyles((theme) => ({
  root: {},

  row: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },

  col: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  logoBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
  },

  logoStyle: {
    height: "85px",
  },

  logoTextSize: {
    fontWeight: "800",
    fontSize: "2rem",
    color: theme.palette.primary.main,
  },

  authParent: {
    paddingTop: "50px",
    minHeight: "100vh",
    backgroundColor: "rgb(245, 245, 242)",
  },

  center: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    // justifyContent: "center",
    alignItems: "center",
    paddingTop: "160px",
  },

  progressBox: {
    // height: "100vh",
    // display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },

  mainTextBox: {
    display: "flex",
    alignItems: "center",
    maxWidth: "60%",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
    },
  },

  icon: {
    height: "50px",
    [theme.breakpoints.down("sm")]: {
      height: "75px",
    },
    // height: "90px",
    // color: theme.palette.primary.main,
  },

  organizatioName: {
    textDecoration: "underline",
  },

  button: {
    marginTop: "30px",
    color: "white",
    backgroundColor: theme.palette.primary.main,
  },

  loaderBox: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
}));
export default function InvitationLinkHandler(props) {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const { invitationId } = useParams();
  const { team: teamReducer, auth } = useSelector((state) => state);
  const { user } = auth;
  const { emailInvitations, teamDictionary } = teamReducer;

  const { root, row, col } = classes;
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const userId = user?._id;
  const [teamPath, setTeamPath] = useState("/");
  const [loading, setLoading] = useState(true);
  const [invite, setInvite] = useState({});
  console.log({ userId });
  function handleClick(el) {
    // console.log({ teamPath });
    // console.log("hello world");
    history.push(teamPath);
  }

  useEffect(() => {
    console.log("Invite link handler");
    if (userId) {
      const newSet = new Set(emailInvitations);
      const profile = user.profile;
      newSet.add(invitationId);
      Api.post("invite/accept", {
        invite: invitationId,
        profile,
      })
        .then(() => {
          Api.post("invite/get", {
            inviteId: invitationId,
          })
            .then((invite) => {
              console.log(".........................", { invite });
              setInvite(invite);
              const team = invite?.team;
              const parentModelName = team?.parentModelName;
              const teamId = team?._id;

              const newTeamDict = teamDictionary;
              newTeamDict[teamId] = team;
              dispatch({
                type: "AddTeam",
                payload: {
                  teamDictionary: newTeamDict,
                },
              });

              if (invite?.invitee) {
                setTeamPath(`/${parentModelName}s/${teamId}`);
                setLoading(false);
              } else {
                dispatch({
                  type: "AddTeam",
                  payload: {
                    emailInvitations: Array.from(newSet),
                  },
                });
                setTeamPath(`/${parentModelName}s/${teamId}`);
                setLoading(false);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      dispatch({
        type: "AddAuth",
        payload: {
          redirect: {
            type: "Invite",
            payload: invitationId,
          },
        },
      });

      history.push("/authenticate");
    }
  }, [userId]);

  return (
    <div className={classes.root}>
      {userId ? (
        !loading ? (
          <>
            <div className={classes.center}>
              <div className={classes.logoBox}>
                <img src={LogoPrimary} className={classes.logoStyle} />
                <Typography variant="h4" className={cx(classes.logoTextSize)}>
                  ContractFlo
                </Typography>
              </div>
              <div className={classes.mainTextBox}>
                <Typography variant="h5" align="center">
                  {/* <EmailIcon className={classes.icon} /> */}
                  Invitation for{" "}
                  <span className={classes.organizatioName}>
                    {invite?.team?.parent?.displayName || ""}
                  </span>{" "}
                  {invite?.teamType} is Accepted
                </Typography>
              </div>
              <Button className={classes.button} onClick={handleClick}>
                Go to {invite?.teamType}
              </Button>
            </div>
          </>
        ) : (
          <div className={classes.loaderBox}>
            <CircularProgress size={isSmall ? "50px" : "80px"} />
          </div>
        )
      ) : (
        <div />
      )}
    </div>
  );
}
