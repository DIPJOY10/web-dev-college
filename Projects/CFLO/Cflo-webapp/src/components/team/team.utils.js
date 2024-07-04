import Api from "../../helpers/Api";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import taskUtils from "../task/task.utils";
import { setInvestments } from "../Investment/investment.utils";
import _ from "lodash";
import { nanoid } from "nanoid";

// import { setDocs } from "../doc/doc.utils";
// import { setDocFolders } from "../doc/doc.folder.utils";
import arrayToReducer from "../../helpers/arrayToReducer";


const permissionArray = ["Viewer", "Editor", "Admin", "Owner"];

const permissionPower = {
  Owner: 4,
  Admin: 3,
  Editor: 2,
  Viewer: 1,
};

// export function useGetTeamProfiles(teamId, callBool, setCallBool) {
//   const profileReducer = useSelector((state) => state.profile);
//   const teamReducer = useSelector((state) => state.team);
//   const dispatch = useDispatch();
//   const {
//     teamIds,
//   } = teamReducer;
//   const {
//     profileIds,
//     profileDictionary,
//   } = profileReducer;

//   const pIdOld = profileIds||[];
//   const pDOld = profileDictionary||{};

//   useEffect(() => {
//     if (callBool) {
//       Api.post('team/getProfiles', {
//         teamIds: teamId?[teamId]: teamIds,
//       }).then((res)=>{
//         if (res?.data?.profileIds?.length>0) {
//           const teams = res?.data;
//           var newProfileDict = {}
//           var newProfileArr = []
//           const {

//           } = arrayToReducer(teams)
//           dispatch({
//             type: 'AddProfile',
//             payload: {
//               profileIds: Array.from(new Set([...pIdOld, ...pIds])),
//               profileDictionary: {
//                 ...profileDictionary,
//                 ...pDOld,
//               },
//             },
//           });

//           setCallBool(false);
//         }
//       });
//     }
//   }, [callBool]);
// }

function recursiveTree(teamParentId, children) {
  if (children && children.length > 0) {
    const firstLevelTeamIds = children
      .filter((team) => team.parentTeam == teamParentId)
      .map((team) => team._id);

    return {
      teamId: teamParentId,
      children: firstLevelTeamIds.map((teamId) => {
        const secondLevelTeams = children.filter(
          (team) => team.ancestors.indexOf(teamId) > -1
        );
        const newObject = {
          teamId,
          children: recursiveTree(teamId, secondLevelTeams),
        };
        return newObject;
      }),
    };
  } else {
    return [];
  }
}

function useSortedTeamHook() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);
  const { team: teamReducer } = state;
  const { sortedProjectTeamIds, teamIds } = teamReducer;

  useEffect(() => {
    Api.post("team/getDeepTeams", {
      teamIds: sortedProjectTeamIds,
    }).then((res) => {
      const teamMapArray = res.result;
      console.log(res, " is the res");
      // console.log(teamMapArray,' is the teamMap')
      let teams = [];
      const sortedProjectMap = {};
      const groupedProjectMap = {};

      if (teamMapArray && teamMapArray.length > 0) {
        teamMapArray.map((teamMap) => {
          const teamId = teamMap.teamId;
          groupedProjectMap[teamId] = teamMap.teams.map((team) => team._id);
          teams = _.concat(teams, teamMap.teams);
          sortedProjectMap[teamId] = recursiveTree(teamId, teamMap.teams);
          // console.log(recursiveTree(teamId,teamMap.teams),' is the recursive map')
        });
      }

      console.log(teamMapArray, " is the teamMapArray");

      console.log(sortedProjectMap, " is the sortedProjectMap");
      console.log(groupedProjectMap, " is the groupedProjectMap");

      dispatch({
        type: "AddTeam",
        payload: {
          sortedProjectMap,
          groupedProjectMap,
        },
      });

      handleTeams(teams, state, dispatch);
    });
  }, [sortedProjectTeamIds]);
}


const handleTeamParentData = (teamId, newData, state, dispatch) => {
  //newData is the updated parent data. before that update the parent via some api call
  const { team: teamReducer } = state;
  const { teamDictionary } = teamReducer;
  const team = teamDictionary[teamId];
  const parent = team?.parent;
  const objPath = teamId + ".parent";
  const newParent = { ...parent, ...newData };
  console.log(newParent);
  const newTeamDictionary = _.set(teamDictionary, objPath, newParent);
  console.log(newTeamDictionary);
  dispatch({
    type: "AddTeam",
    payload: {
      teamDictionary: newTeamDictionary,
    },
  });
};

const processTeamTree = (teamReducer, dispatch) => {
  const {
    teamDictionary,
    teamIds,
    sortedProjectTeamIds: oldSortedProjectIds,
  } = teamReducer;

  const orgTeamIds = [];

  const projectTeamIds = [];

  if (teamIds && teamIds.length) {
    teamIds.map((teamId) => {
      const team = teamDictionary[teamId];

      if (team && team._id) {
        const { parent, parentModelName } = team;

        switch (parentModelName) {
          case "Organization":
            orgTeamIds.push(teamId);
            break;

          case "Project":
            projectTeamIds.push(teamId);
            break;

          default:
            break;
        }
      }
    });

    const sortedProjectTeamIds = projectTeamIds.filter(
      (teamId) =>
        _.intersection(projectTeamIds, teamDictionary[teamId].ancestors)
          .length == 0
    );

    // console.log(projectTeamIds,sortedProjectTeamIds,' process team tree');

    const diffSortedProjectIds = _.difference(
      sortedProjectTeamIds,
      oldSortedProjectIds
    );

    if (diffSortedProjectIds.length > 0 && sortedProjectTeamIds.length > 0) {
      dispatch({
        type: "AddTeam",
        payload: {
          orgTeamIds,
          projectTeamIds,
          sortedProjectTeamIds,
        },
      });
    } else {
      dispatch({
        type: "AddTeam",
        payload: {
          orgTeamIds,
          projectTeamIds,
        },
      });
    }
  }
};

const _evaluateMutualPermission = (memberId, userId, team) => {
  const { permissions } = team;
  console.log("memberUserId", userId);
  const userRole = _.get(permissions, userId)
    ? _.get(permissions, userId)
    : "Viewer";
  const userPowerIndex = permissionPower[userRole];
  // console.log('_evaluate ',userPowerIndex,userRole,memberId, userId, team)
  if (memberId) {
    if (_.hasIn(permissions, memberId)) {
      const memberRole = _.get(permissions, memberId);
      const memberPowerIndex = permissionPower[memberRole];
      console.log(
        "memberUserPowerIndex, ",
        userPowerIndex,
        " memberPowerIndex, ",
        memberPowerIndex
      );
      if (memberPowerIndex >= userPowerIndex) {
        return { roles: [], userPowerIndex, memberPowerIndex };
      } else {
        return {
          roles: permissionArray.slice(0, userPowerIndex),
          userPowerIndex,
          memberPowerIndex: memberPowerIndex,
        };
      }
    } else {
      return {
        roles: permissionArray.slice(0, userPowerIndex),
        userPowerIndex,
        memberPowerIndex: 0,
      };
    }
  } else {
    return {
      roles: permissionArray.slice(0, userPowerIndex),
      userPowerIndex,
      memberPowerIndex: 0,
    };
  }
};

const createEmailInvite = (invite) => {
  const promise = new Promise((resolve, reject) => {
    Api.post("invite/email/create", {
      invite,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
};

const _createInvites = (memberRoles, team, user) => {
  const invites = memberRoles.map((memberRole) => {
    return {
      inviteId: nanoid(),
      team: team._id,
      invitee: memberRole.member._id,
      role: memberRole.role,
      invitedById: user.profile,
      teamType: team.parentModelName,
    };
  });

  const promise = new Promise((resolve, reject) => {
    Api.post("invite/create", {
      invites,
    })
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });

  return promise;
};

const _createEmailInvite = (email, role, team, user, setLoading, dispatch) => {
  // const dispatch = useDispatch();
  setLoading(true);
  const invite = {
    inviteId: nanoid(),
    team: team._id,
    email,
    role,
    invitedById: user.profile,
  };

  // console.log(invite,' is the invite', user)

  const promise = new Promise((resolve, reject) => {
    Api.post("invite/create", {
      invites: [invite],
    })
      .then((res) => {
        dispatch({
          type: "AddApiAlert",
          payload: {
            success: true,
            message: "Email Sent successfully",
          },
        });
        setLoading(false);
        resolve(res);
      })
      .catch((err) => {
        dispatch({
          type: "AddApiAlert",
          payload: {
            success: false,
            message: "Email Invite Failed",
          },
        });
        setLoading(false);
        reject(err);
      });
  });

  return promise;
};

const checkRole = (memberId, team) => {
  // console.log(member,team,' is member and team')
  if (team?.participants && memberId) {
    const participants = team.participants;
    if (participants.indexOf(memberId) === -1) {
      // not a participant
      return {
        isMember: false,
      };
    } else {
      // already a participant
      // console.log(team.permissions,' is team.permissions')
      return {
        isMember: true,
        role: team.permissions[memberId],
      };
    }
  }
};

/**
 * This is a special case of above
 *
 */

const hasAdminAccess = (memberId, team) => {
  const role = team.permissions[memberId];

  return role == "Owner" || role == "Admin";
};

export const handleTeams = (teams, state, dispatch) => {
  const { team, project, auth } = state;
  const projects = [];
  const organizations = [];
  const { profileIds: oldProfileIds, user } = auth;
  const userProfile = user?.profile;

  const oldProfileIdSet = new Set(oldProfileIds);
  const { teamIds, teamDictionary } = team;

  const teamIdSet = new Set(teamIds);
  const teamMap = new Map(Object.entries(teamDictionary));
  const userWallet = user?.wallet ? [user.wallet] : [];
  const walletAdminSet = new Set(userWallet);

  if (teams && teams.length > 0) {
    teams.map((team) => {
      const isAdmin = hasAdminAccess(userProfile, team);
      if (team && team._id) {
        const teamId = team._id;
        const walletId = team?.wallet;
        switch (team.parentModelName) {
          case "Organization":
            var organization = team.parent;

            organizations.push(team.parent);

            if (organization?.public) {
              oldProfileIdSet.add(team.parent.profile);
            }
            if (isAdmin && walletId) {
              walletAdminSet.add(walletId);
            }
            break;

          case "Project":
            projects.push(team.parent);
            break;

          default:
            break;
        }

        let newTeam = team;
        const oldTeam = teamDictionary[teamId];
        if (oldTeam) {
          newTeam = _.merge(oldTeam, team);
        }

        teamIdSet.add(team._id);

        teamMap.set(team._id, newTeam);
      }
    });

    dispatch({
      type: "AddAuth",
      path: {
        profileIds: Array.from(oldProfileIdSet),
      },
    });

    handleOrganizationTeams(organizations, auth, dispatch);
    handleProjectTeams(projects, project, dispatch);

    dispatch({
      type: "AddTeam",
      payload: {
        teamDictionary: Object.fromEntries(teamMap.entries()),
        teamIds: Array.from(teamIdSet),
      },
    });
  }
};

const handleProjectTeams = (projects, project, dispatch) => {
  const { projectIds, projectDictionary } = project;

  const projectIdSet = new Set(projectIds);
  const projectMap = new Map(Object.entries(projectDictionary));

  projects.map((newProject) => {
    const newProjectId = newProject?._id;

    if (newProjectId) {
      projectIdSet.add(newProjectId);

      projectMap.set(newProjectId, newProject);
    }
  });

  dispatch({
    type: "AddProject",
    payload: {
      projectDictionary: Object.fromEntries(projectMap.entries()),
      projectIds: Array.from(projectIdSet),
    },
  });
};

const handleOrganizationTeams = (organizations, auth, dispatch) => {
  const { organizationIds, organizationDictionary } = auth;
  const organizationIdSet = new Set(organizationIds);
  const organizationMap = new Map(Object.entries(organizationDictionary));

  if (organizations && organizations.length > 0) {
    organizations.map((newOrganization) => {
      const newOrganizationId = newOrganization?._id;

      organizationIdSet.add(newOrganizationId);

      organizationMap.set(newOrganizationId, newOrganization);
    });

    dispatch({
      type: "AddAuth",
      payload: {
        organizationIds: Array.from(organizationIdSet),
        organizationDictionary: Object.fromEntries(organizationMap.entries()),
      },
    });
  }
};

const handleMemberProfiles = (team) => {
  const memberDictionary = {};
  team.allTimeMembers.map((member) => {
    const profile = member.modelId;
    const memberId = profile._id;
    memberDictionary[memberId] = profile;
  });
  return {
    memberDictionary,
  };
};

export default {
  permissionArray,
  permissionPower,
  // useSortedTeamHook,

  handleTeamParentData,
  processTeamTree,
  _evaluateMutualPermission,
  _createInvites,
  _createEmailInvite,
  checkRole,
  handleProjectTeams,
  handleOrganizationTeams,
  handleTeams,
  handleMemberProfiles,
};
