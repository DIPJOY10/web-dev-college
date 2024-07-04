import _ from 'lodash';
import arrayToReducer from '../../helpers/arrayToReducer';

export const setInvestments = (investments, dashboard, dispatch) => {
  const { investmentIds = [], investmentDictionary } = dashboard;
  if (investments && investments.length > 0) {
    const {
      idArr, newDict
    } = arrayToReducer(investments)


    const investmentIdSet = new Set(_.concat(investmentIds, idArr));

    dispatch({
      type: 'AddDashboard',
      payload: {
        investmentDictionary: {
          ...investmentDictionary,
          ...newDict,
        },
        investmentIds: Array.from(investmentIdSet),
      },
    });

    return idArr;
  }
};

export const setInvestmentApps = (investmentId, applications, dashboard, dispatch) => {
  const { investmentDictionary, appDictionary } = dashboard;
  const investment = investmentDictionary[investmentId];

  if (applications && applications.length > 0) {
    const newApplicationIds = [];
    const newApplicationDictionary = {};
    applications.map((application) => {
      const applicationId = application._id;
      newApplicationIds.push(applicationId);
      newApplicationDictionary[applicationId] = application;
    });
    const newAppDictionary = {
      ...appDictionary,
      ...newApplicationDictionary,
    };

    const newInvestmentObject = {};

    if (investment?.appIds && investment.appIds.length > 0) {
      const newAppIdSet = new Set([...newApplicationIds, ...investment.appIds]);
      let newAppIds = Array.from(newAppIdSet);
      newAppIds = newAppIds.sort((aId, bId) => {
        const a = newAppDictionary[aId].createdAt;
        const b = newAppDictionary[bId].createdAt;
        return a - b;
      });
      newInvestmentObject[investmentId] = {
        ...investment,
        appIds: newAppIds,
      };
    }
    else {
      let newAppIds = newApplicationIds;
      newAppIds = newAppIds.sort((aId, bId) => {
        const a = newAppDictionary[aId].createdAt;
        const b = newAppDictionary[bId].createdAt;
        return a - b;
      });
      newInvestmentObject[investmentId] = {
        ...investment,
        appIds: newAppIds,
      };
    }

    dispatch({
      type: 'AddDashboard',
      payload: {
        appDictionary: newAppDictionary,
        investmentDictionary: {
          ...investmentDictionary,
          ...newInvestmentObject,
        },
      },
    });
  }
};
