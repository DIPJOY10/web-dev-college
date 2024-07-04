import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setJobApps } from '../job/job.utils';
import { setInvestmentApps } from '../Investment/investment.utils';
import { useHistory, useLocation } from 'react-router-dom';
import Api from '../../helpers/Api';

export const useGetApps = function (parent, model) {
  const dashboard = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  useEffect(() => {
    Api.post('apply/getApps', {
      parent, model,
    }).then((res) => {
      const {
        apps,
      } = res;

      switch (model) {
        case 'Job':
          setJobApps(parent, apps, dashboard, dispatch);
          break;

        case 'Investment':
          setInvestmentApps(parent, apps, dashboard, dispatch);
          break;

        default:
          break;
      }
    });
  }, [parent, model]);
};
