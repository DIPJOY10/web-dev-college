import React, { useState, useEffect } from "react";
import Api from "../../helpers/Api";
import { useSelector } from "react-redux";
import _ from "lodash";

function useGetAdminProfiles() {
  // const [adminProfileIds, setAdminProfileIds] = useState([])
  const [orgTeams, setOrgTeams] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [adminProfiles, setAdminProfiles] = useState([]);
  const [adminProfileIds, setAdminProfileIds] = useState([user?.profile]);

  const getBasicData = async () => {
    const res = await Api.post("profile/getAdminProfiles", {
      profileId: user?.profile,
    });

    setLoading(false);

    if (res?.data) {
      const data = res?.data;
      const adminProfileIdRes = res.data.adminProfileIds;
      const orgTeamRes = data.orgTeams;
      setAdminProfileIds(adminProfileIdRes);

      var orgs = orgTeamRes.map((orgTeam) => orgTeam?.parent);
      var profileOrgDict = _.groupBy([user, ...orgs], "profile");
      var adminProfiles = [];
      adminProfileIdRes.map((profileId) => {
        const arr = profileOrgDict[profileId];
        adminProfiles = [...adminProfiles, ...(arr || [])];
      });

      setAdminProfiles(adminProfiles);
      setOrgTeams(orgTeamRes);
    }
  };

  useEffect(() => {
    getBasicData();
  }, []);

  return {
    adminProfiles,
    adminProfileIds,
    orgTeams,
    loading,
  };
}

export default useGetAdminProfiles;
