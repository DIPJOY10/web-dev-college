import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Api from "../../helpers/Api";
import { setUserProfiles } from "./profile.utils";

function useProfile() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);
  const {
    user,
    organizationIds,
    organizationDictionary,
    profileIds,
    profileDictionary,
  } = auth;

  useEffect(() => {
    if (user && user.profile) {
      const profileId = user.profile;
      const profile = profileDictionary[profileId];
      if (profile) {
        // do nothing
      } else {
        // get profile
        Api.post("profile/get", {
          profileIds: [profileId],
        }).then((profiles) => {
          // check if profiles returned are valid object

          const newProfiles = profiles.filter((profile) => profile?._id);
          setUserProfiles(newProfiles, auth, dispatch);
        });
      }
    } else if (user && user._id) {
      Api.post("profile/createAndSetForUser", {
        user: user._id,
      }).then((profile) => {
        // check if profiles returned are valid object
        dispatch({
          type: "AddAuth",
          payload: {
            user: {
              ...user,
              profile: profile._id,
            },
          },
        });
        setUserProfiles([profile], auth, dispatch);
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && user.profile) {
      const profileIdSet = new Set([]);
      organizationIds.map((organizationId) => {
        const organization = organizationDictionary[organizationId];
        profileIdSet.add(organization?.profile);
      });
      profileIdSet.add(user.profile);
      const newProfileIds = Array.from(profileIdSet).filter(
        (profileId) => profileId
      );

      Api.post("profile/get", {
        profileIds: newProfileIds,
      }).then((profiles) => {
        // check if profiles returned are valid object
        if (profiles && profiles.length > 0) {
          const newProfiles = profiles.filter((profile) => profile?._id);
          setUserProfiles(newProfiles, auth, dispatch);
        }
      });
    }
  }, [organizationIds]);
}

export default useProfile;
