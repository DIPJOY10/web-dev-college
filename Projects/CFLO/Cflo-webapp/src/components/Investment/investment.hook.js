import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Api from '../../helpers/Api';
import arrayToReducer from '../../helpers/arrayToReducer';
import _ from 'lodash';
export const useInvestment = function (investmentId) {
  const location = useLocation();
  const pathname = location['pathname'];
  // console.log(pathname,' is the pathname')

  const isFeed = pathname.slice(1, 5) == 'feed' || pathname == '/';
  const explore = useSelector((state) => state.explore);
  const dashboard = useSelector((state) => state.dashboard);
  const auth = useSelector((state) => state.auth)
  const user = auth?.user;
  const dispatch = useDispatch()
  const history = useHistory();
  const [loading, setLoading] = useState(false)
  const userProfile = user?.profile;

  const { investmentDictionary: exploreMap } = explore;
  const { investmentDictionary: dashboardMap, investmentCatDictionary } = dashboard;
  const investmentDictionary = isFeed ? exploreMap : dashboardMap;
  const investment = investmentDictionary[investmentId];

  const investmentCreate = async (callback) => {
    if (userProfile) {
      setLoading(true)
      const investObj = {
        owner: user?.profile,
        user: user?._id,
        participants: [userProfile],
        ownerModelName: "Profile"
      }
      const res = await Api.post('/investment/create', investObj);
      setLoading(false)
      if (res) {
        const investment = res
        setInvestments([investment], dashboard, dispatch)
        if (callback) {
          callback(investment)
        } else {
          const path = '/dashboard/edit/investment/' + investment?._id;
          history.push(path)
        }

      }
    }

  }
  const setInvestments = (investments, dashboard, dispatch) => {
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
  return {
    investment,
    isFeed,
    investmentCreate,
    setInvestments,
    loading
  };
}
