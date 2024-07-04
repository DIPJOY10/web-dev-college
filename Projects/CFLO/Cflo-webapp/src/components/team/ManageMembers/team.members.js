import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import teamUtils from "../team.utils";
import Card from "@material-ui/core/Card";
import CircularProgress from "@material-ui/core/CircularProgress";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Fab from "@material-ui/core/Fab";
import IconButton from "@material-ui/core/IconButton";
import ExitToAppOutlinedIcon from "@material-ui/icons/ExitToAppOutlined";
import CancelPresentationIcon from "@material-ui/icons/CancelPresentation";
import Api from "../../../helpers/Api";
import { setProfiles } from "../../profile/profile.utils";
import cx from "clsx";

const { _evaluateMutualPermission, permissionPower } = teamUtils;

const useStyles = makeStyles({
  root: {
    flex: 1,
    // width: "100%",
    display: "flex",
    flexDirection: "row",
  },

  fabStyle: {
    height: 25,
    width: 25,
    marginLeft: 10,
    marginTop: 5,
  },

  rowDiv: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: 374,
    maxWidth: "100%",
  },
  avatarStyle: {
    height: 25,
    width: 25,
  },
  nameStyle: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 10,
    color: "#424242",
    flex: 1,
  },
  chipStyle: {
    height: 23,
    margin: 5,
    marginBottom: -15,
  },
});

const TeamMembers = (props) => {
  const {
    teamId,
    setMembers: setMembersProp,
    setPermissions: setPermissionsProp,
    setLoading: setLoadingProp,
    loading: loadingProp,
  } = props;
  const classes = useStyles();
  const { root, rowDiv, avatarStyle, nameStyle, fabStyle, chipStyle } = classes;
  const { teamDictionary } = useSelector((state) => state.team);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const team = teamDictionary[teamId];

  //   const [participants, setParticipants] = useState(props?.members);
  //   const [permissions, setPermissions] = useState(
  //     props?.permissions || team?.permissions
  //   );
  const participants = props?.members;
  const permissions = props?.permissions;

  console.log("in members", participants, permissions, props);
  const { team: teamReducer, profile: profileReducer } = useSelector(
    (state) => state
  );

  const { profileDictionary } = profileReducer;

  //   useEffect(() => {
  //     setParticipants(props?.members);
  //   }, [props?.members]);
  //   useEffect(() => {
  //     setPermissions(props?.permissions);
  //   }, [props?.permissions]);

  //   const getUsers = () => {
  //     const userIds = participantIds.filter((userId) => {
  //       const user = profileDictionary && profileDictionary[userId];
  //       return user ? false : true;
  //     });
  //     console.log("in func", userIds);
  //     if (userIds && userIds.length > 0) {
  //       Api.post("user/getByIds", {
  //         userIds,
  //       })
  //         .then((users) => {
  //           console.log(users, " are the profiles returned");
  //           setProfiles(users, profileReducer, dispatch);
  //         })
  //         .catch((err) => {
  //           console.log("error is ", err);
  //         });
  //     }
  //   };

  const _changeMemberRole = (memberId, role) => {
    setLoadingProp(true);
    Api.post("team/changeMemberRole", {
      member: memberId,
      role,
      team: teamId,
    }).then((newTeam) => {
      console.log("newTeam", newTeam);
      setPermissionsProp(newTeam?.permissions || {});
      const newTeamObject = {};
      newTeamObject[teamId] = {
        ...team,
        permissions: newTeam.permissions,
      };
      const newTeamDictionary = {
        ...teamDictionary,
        ...newTeamObject,
      };

      dispatch({
        type: "AddTeam",
        payload: {
          teamDictionary: newTeamDictionary,
        },
      });
    });
    setLoadingProp(false);
  };

  useEffect(() => {
    // getUsers();
  }, []);

  return (
    <>
      {!loadingProp ? (
        participants.map((member) => {
          // const member = profileDictionary && profileDictionary[memberId];
          const memberId = member?._id;
          console.log("member is: ", member);
          if (member) {
            const { displayName, displayPicture: dP } = member?.parent || {};
            const isUser = memberId === user._id;
            const role = permissions[memberId];
            const dPUrl = dP?.thumbUrl ? dP.thumbUrl : dP.url;

            return (
              <div className={cx(root)}>
                <Card variant="outlined">
                  <CardContent>
                    <div className={rowDiv}>
                      <Avatar
                        className={avatarStyle}
                        alt={displayName}
                        src={dPUrl}
                      />
                      <Typography className={nameStyle}>
                        {displayName}
                      </Typography>
                      <Chip label={role} color="primary" />
                      {isUser ? (
                        <IconButton className={fabStyle}>
                          <ExitToAppOutlinedIcon />
                        </IconButton>
                      ) : null}
                    </div>
                    <div className={rowDiv}>
                      {permissions[user?.profile] === "Admin" ||
                      permissions[user?.profile] === "Owner" ? (
                        _evaluateMutualPermission(
                          memberId,
                          user?.profile,
                          team
                        ).roles.map((roleElem) => {
                          const isChipSelected =
                            roleElem === role ? true : false;

                          return (
                            <>
                              <Chip
                                label={roleElem}
                                className={chipStyle}
                                color={isChipSelected ? "primary" : "disabled"}
                                onClick={() =>
                                  _changeMemberRole(memberId, roleElem)
                                }
                              />
                            </>
                          );
                        })
                      ) : (
                        <></>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          } else {
            return null;
          }
        })
      ) : (
        <CircularProgress />
      )}
    </>
  );
};

export default TeamMembers;
