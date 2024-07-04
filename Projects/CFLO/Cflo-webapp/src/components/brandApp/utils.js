import Api from '../../helpers/Api';
import arrayToReducer from '../../helpers/arrayToReducer';

export const setBrandApps = (apps, auth, dispatch)=>{
  const {
    brandAppDictionary: oldDict,
  } = auth;

  const brandAppDictionary = oldDict?oldDict:{};

  if (apps?.length>0) {
    const {
      newDict,
    } = arrayToReducer(apps);

    dispatch({
      type: 'AddAuth',
      payload: {
        brandAppDictionary: {
          ...brandAppDictionary,
          ...newDict,
        },
      },
    });
  }
};

export const setBrandAppNetworks = (apps, auth, dispatch)=>{
  const {
    brandAppNetworkDictionary: oldDict,
  } = auth;

  const brandAppNetworkDictionary = oldDict?oldDict:{};

  if (apps?.length>0) {
    const {
      newDict,
    } = arrayToReducer(apps);

    dispatch({
      type: 'AddAuth',
      payload: {
        brandAppNetworkDictionary: {
          ...brandAppNetworkDictionary,
          ...newDict,
        },
      },
    });
  }
};

export const setNetworkProjects = (networkId, apps, auth, dispatch)=>{
  const {
    networkProjectMap: oldDict,
  } = auth;

  const networkProjectMap = oldDict?oldDict:{};

  if (apps?.length>0) {
    const newDict = {};

    const teamIds = apps.map((app)=>app?.projectTeam);

    newDict[networkId] = teamIds;

    dispatch({
      type: 'AddAuth',
      payload: {
        networkProjectMap: {
          ...networkProjectMap,
          ...newDict,
        },
      },
    });
  }
};

export const addNetworkProject = (networkId, projectId, auth, dispatch)=>{
  const {
    networkProjectMap: oldDict,
  } = auth;

  const networkProjectMap = oldDict?oldDict:{};

  const newDict = {};

  const oldArray = networkProjectMap[networkId];
  if (oldArray&&oldArray.length>0) {
    const oldSet = new Set(oldArray);
    oldSet.add(projectId);
    newDict[networkId] = Array.from(oldSet);
  }
  else {
    newDict[networkId] = [projectId];
  }

  dispatch({
    type: 'AddAuth',
    payload: {
      networkProjectMap: {
        ...networkProjectMap,
        ...newDict,
      },
    },
  });
};

export const removeNetworkProject = (networkId, projectId, auth, dispatch)=>{
  const {
    networkProjectMap: oldDict,
  } = auth;

  const networkProjectMap = oldDict?oldDict:{};

  const newDict = {};

  const oldArray = networkProjectMap[networkId];
  if (oldArray&&oldArray.length>0) {
    const oldSet = new Set(oldArray);
    oldSet.delete(projectId);
    newDict[networkId] = Array.from(oldSet);
  }
  else {
    newDict[networkId] = [projectId];
  }

  dispatch({
    type: 'AddAuth',
    payload: {
      networkProjectMap: {
        ...networkProjectMap,
        ...newDict,
      },
    },
  });
};


export const updateBrandApp = async ({
  app, auth, dispatch, setLoading,
})=>{
  const appId = app?._id;

  const {
    brandAppDictionary,
  } = auth;

  const brandApp = brandAppDictionary[appId];

  if (setLoading) {
    setLoading(true);
  }

  const res = await Api.post('brand/app/update', {
    app,
  });

  if (setLoading) {
    setLoading(false);
  }


  if (res.data) {
    const {
      newDict,
    } = arrayToReducer([{
      ...brandApp, ...app,
    }]);

    dispatch({
      type: 'AddAuth',
      payload: {
        brandAppDictionary: {
          ...brandAppDictionary,
          ...newDict,
        },
      },
    });
  }
};


export const updateBrandNetworkApp = async ({
  app, auth, dispatch, setLoading,
})=>{
  const appId = app?._id;

  const brandAppNetworkDictionary =
     auth?.brandAppNetworkDictionary||{};

  const brandApp = brandAppNetworkDictionary[appId];


  if (setLoading) {
    setLoading(true);
  }

  const res = await Api.post('brand/app/update', {
    app,
  });

  if (setLoading) {
    setLoading(false);
  }

  const {
    newDict,
  } = arrayToReducer([{
    ...brandApp, ...app,
  }]);

  dispatch({
    type: 'AddAuth',
    payload: {
      brandAppNetworkDictionary: {
        ...brandAppNetworkDictionary,
        ...newDict,
      },
    },
  });
};


export const setRentalReqs = ( apps, auth, dispatch )=>{
  const {
    rentalReqDictionary: oldDict,
  } = auth;

  const rentalReqDictionary = oldDict?oldDict:{};

  if (apps?.length>0) {
    const {
      newDict,
    } = arrayToReducer(apps);

    dispatch({
      type: 'AddAuth',
      payload: {
        rentalReqDictionary: {
          ...rentalReqDictionary,
          ...newDict,
        },
      },
    });
  }
};
