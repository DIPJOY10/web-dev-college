
export const setRoleMaps = (roleMaps, roleMapReducer, dispatch)=>{
  const {roleMapDictionary} = roleMapReducer;
  const newRoleMapDictionary = {};
  const roleMapIds = [];
  roleMaps.map((roleMap)=>{
    const roleMapId = roleMap._id;
    roleMapIds.push(roleMapId);
    newRoleMapDictionary[roleMapId] = roleMap;
  });


  const roleMapIdSet = new Set(roleMapIds);
  // console.log(roleMapIds,roleMapIdSet,Array.from(roleMapIdSet))
  dispatch({
    type: 'AddRoleMap',
    payload: {
      roleMapDictionary: {
        ...roleMapDictionary,
        ...newRoleMapDictionary,
      },
    },
  });

  return {
    roleMapIds: Array.from(roleMapIdSet),
  };
};
