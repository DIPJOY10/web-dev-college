import React, { useEffect, useRef, useState } from "react";
import Api from "../../helpers/Api";

function useGetProfile(profileId) {
  const [profile, setProfile] = useState(null);

  const getApi = async () => {
    const a = new Date();
    const res = await Api.post("profile/getProfile", {
      profileId: profileId,
    });
    const b = new Date();
    // console.log('profilegetreceived ',b-a, res)
    if (res?.data) {
      const data = res?.data;
      setProfile(data);
    }
  };

  useEffect(() => {
    getApi();
  }, [profileId]);

  return profile;
}

export default useGetProfile;
