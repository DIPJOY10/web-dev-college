import _ from 'lodash';
import Api from '../../helpers/Api';
import arrayToReducer from '../../helpers/arrayToReducer';

export const setData = ( orgs, users, profile, dispatch) =>{
  const {
    orgDictionary, personDictionary,
  } = profile;

  const newOrgObject = {};
  const newPersonObject = {};

  if (orgs&&orgs.length>0) {
    orgs.map((org)=>{
      const orgId = org?._id;
      if (orgId) {
        newOrgObject[orgId] = org;
      }
    });
  }

  if (users&&users.length>0) {
    users.map((user)=>{
      const userId = user?._id;
      if (userId) {
        newPersonObject[userId] = user;
      }
    });
  }


  dispatch({
    type: 'AddProfile',
    payload: {
      personDictionary: {
        ...personDictionary,
        ...newPersonObject,
      },
      orgDictionary: {
        ...orgDictionary,
        ...newOrgObject,
      },
    },
  });
};

export const setProfiles = (profiles, profileReducer, dispatch)=>{
  const {
    profileDictionary,
  } = profileReducer;

  let {
    newDict, 
  } = arrayToReducer(profiles)

  dispatch({
    type: 'AddProfile',
    payload: {
      profileDictionary: {
        ...profileDictionary,
        ...newDict
      },
    },
  });
};


export const setUserProfiles = (profiles, auth, dispatch)=>{
  const {profileIds, profileDictionary} = auth;
  if (profiles&&profiles.length>0) {
    const newProfileIds = [];
    const newProfileDictionary = {};
    profiles.map((profile)=>{
      const profileId = profile?._id;
      if (profileId) {
        newProfileIds.push(profileId);
      }

      newProfileDictionary[profileId] = profile;
    });

    const profileIdSet = new Set(_.concat(profileIds, newProfileIds));
    const array = Array.from(profileIdSet).filter((profileId)=>profileId);


    dispatch({
      type: 'AddAuth',
      payload: {
        profileDictionary: {
          ...profileDictionary,
          ...newProfileDictionary,
        },
        profileIds: array,
      },
    });

    return newProfileIds;
  }
};

export const updateUser = ( userObject, auth, dispatch )=>{
  Api.post('user/update', userObject).then((user)=>{
    dispatch({
      type: 'AddAuth',
      payload: {
        user: user,
      },
    });
  });
};

export const updateOrg = ( orgObject, auth, dispatch )=>{
  const {organizationDictionary} = auth;
  if (orgObject&&orgObject._id) {
    const orgId = orgObject._id;
    Api.post('organization/update', orgObject).then((organization)=>{
      const newObject = {};
      newObject[orgId] = organization;
      dispatch({
        type: 'AddAuth',
        payload: {
          organizationDictionary: {
            ...organizationDictionary,
            ...newObject,
          },
        },
      });
    });
  }
};
