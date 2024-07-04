import {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import Api from '../../helpers/Api';
import taskUtils from './task.utils';

const {
  setTaskMap,
} = taskUtils;

export const useGetTaskMap = (taskMapId)=>{
  const dispatch = useDispatch();
  const task = useSelector((state) => state.task);
  const {
    taskMapDictionary,
  } = task;

  const taskMap = taskMapDictionary[taskMapId];

  useEffect(() => {
    if (taskMap) {

    }
    else {
      if (taskMapId) {
        Api.post('task/map/get', {
          taskMapId,
        }).then((taskMap)=>{
          setTaskMap([taskMap], task, dispatch);
        });
      }
    }
  }, [taskMapId]);
};

