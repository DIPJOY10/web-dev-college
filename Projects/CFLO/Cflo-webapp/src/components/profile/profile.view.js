import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { useHistory, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Avatar from "@material-ui/core/Avatar";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import cx from "clsx";
import baseStyle from "../styled/base/index";
import Api from "../../helpers/Api";
import UserProfileTopView from "./UserProfileTopView";
import OrgProfileTopView from "./OrgProfileTopView";
import useGetAdminProfiles from "./useGetAdminProfiles";

const useStyles = makeStyles((theme) => ({
  ...baseStyle,
}));

export default function ProfileView(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { root, row, col } = classes;
  const auth = useSelector((state) => state.auth);
  const { user } = auth;
  const userProfileId = user.profile;
  const { profileId } = useParams();

  const [profile, setProfile] = useState(null);
  const { adminProfiles } = useGetAdminProfiles();
  const getProfile = async () => {
    const res = await Api.post("profile/getProfileParent", {
      profileId,
    });

    if (res?.data) {
      // console.log(res.data);
      setProfile(res.data);
      console.log(res.data);
    }
  };
  
  useEffect(() => {
    getProfile();
  }, [profileId]);

  switch (profile?.parentModelName) {
    case "Organization":
      break;

    case "User":
      break;

    default:
      break;
  }

  return (
    <div className={root}>
      {profile?._id ? (
        profile?.parentModelName === "User" ? (
          <UserProfileTopView
            profile={profile}
            adminProfiles={adminProfiles}
            onSearch={true}
            isOwnProfile={userProfileId === profileId}
          />
        ) : (
          <OrgProfileTopView
            profile={profile}
            adminProfiles={adminProfiles}
            onSearch={true}
          />
        )
      ) : null}
    </div>
  );
}
