import Api from "../../helpers/Api";
import teamUtils from "../team/team.utils";
import { setUserProfiles } from "../profile/profile.utils";
const { handleTeams } = teamUtils;

export const goPublic = (orgId, auth, dispatch) => {
  Api.post("organization/goPublic", {
    orgId,
  }).then((res) => {
    const { org, profile } = res;

    setOrgs([org], auth, dispatch);
    setUserProfiles([profile], auth, dispatch);
  });
};

export const updateOrg = (org, state, dispatch, callback) => {
  const { auth } = state;
  const { organizationDictionary } = auth;

  Api.post("organization/update", org).then((organization) => {});

  const orgId = org._id;
  const newOrganizationDictionary = {};
  newOrganizationDictionary[orgId] = org;

  dispatch({
    type: "AddAuth",
    payload: {
      organizationDictionary: {
        ...organizationDictionary,
        ...newOrganizationDictionary,
      },
    },
  });
};

export const setOrgs = (organizations, auth, dispatch) => {
  const { organizationDictionary } = auth;

  if (organizations && organizations.length > 0) {
    const newOrganizationDictionary = {};

    organizations.map((organization) => {
      const organizationId = organization._id;
      newOrganizationDictionary[organizationId] = organization;
    });

    dispatch({
      type: "AddAuth",
      payload: {
        organizationDictionary: {
          ...organizationDictionary,
          ...newOrganizationDictionary,
        },
      },
    });
  }
};

export const createOrg = (orgData, state, dispatch, callback, setLoading, addCreatedOne) => {
  const { auth } = state;
  setLoading(true);
  Api.post("organization/create", orgData)
  .then((teamAndProfile) => {
    
    const { team, profile } = teamAndProfile;
    console.log({ team, profile });
    handleTeams([team], state, dispatch);
    setUserProfiles([profile], auth, dispatch);
    callback(team);
    setLoading(false);

    addCreatedOne(team)

    dispatch({
      type: "AddApiAlert",
      payload: {
        success: true,
        message: "Organization created successfully",
      },
    });
  });
};

export const updateOrgInfo = async (orgData, dispatch) => {
  try {
    const updatedData = await Api.post("/organization/updateOrgInfo", orgData);
    console.log(updatedData.data);
    dispatch({
      type: "AddApiAlert",
      payload: {
        success: true,
        message: "Data updated successfully",
      },
    });
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const updateOrgInfoArray = async (orgData, dispatch) => {
  try {
    const updatedData = await Api.post(
      "/organization/updateOrgInfoArray",
      orgData
    );
    console.log(updatedData.data);
    dispatch({
      type: "AddApiAlert",
      payload: {
        success: true,
        message: "Added Successfully!",
      },
    });
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const editOrgInfoArray = async (orgData, dispatch) => {
  try {
    const updatedData = await Api.post("/organization/edit/array", orgData);
    console.log(updatedData.data);
    dispatch({
      type: "AddApiAlert",
      payload: {
        success: true,
        message: "Updated Successfully!",
      },
    });
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteOrgArrayItem = async (orgData, dispatch) => {
  try {
    const updatedData = await Api.post("/organization/delete/array", orgData);
    console.log(updatedData.data);
    dispatch({
      type: "AddApiAlert",
      payload: {
        success: true,
        message: "Deleted Successfully!",
      },
    });
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};

export const saveOrgProjectInfo = async (projectData) => {
  try {
    const updatedData = await Api.post(
      "/organization/updateProjectInfo",
      projectData
    );
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteOrgProjectPic = async (projectData) => {
  try {
    const updatedData = await Api.post(
      "/organization/delete/projectPic",
      projectData
    );
    console.log(updatedData.data);
    return updatedData.data;
  } catch (error) {
    console.log(error);
  }
};
export const updateFileFlag = async (fileData) => {
  try {
    await Api.post("/organization/updateFileDelete", fileData);
  } catch (error) {
    console.log(error);
  }
};

export const changeUserAndReset = (oldModel, newModel, dispatch) => {
  const oldModelType = oldModel.model;
  const newModelType = newModel.model;

  if (oldModelType === "User" && newModelType === "Organization") {
    dispatch({
      type: "AddAuth",
      payload: {
        userOrganization: oldModel,
        user: newModel,
      },
    });
  }

  if (oldModelType === "Organization") {
    dispatch({
      type: "AddAuth",
      payload: {
        user: newModel,
      },
    });
  }

  dispatch({ type: "ChatReset" });
  dispatch({ type: "ProjectReset" });
};
