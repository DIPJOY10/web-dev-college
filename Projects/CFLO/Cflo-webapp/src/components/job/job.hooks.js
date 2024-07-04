import React, { useState, useEffect } from "react";
import Api from "../../helpers/Api"
import arrayToReducer from "../../helpers/arrayToReducer";
import {useSelector, useDispatch} from 'react-redux';
import {
    useHistory, useLocation,
  } from 'react-router-dom';

export const useJobApi = () => {
    const dashboard = useSelector((state) => state.dashboard);
    const auth = useSelector((state) => state.auth)
    const user = auth?.user;
    const dispatch  = useDispatch()
    const history = useHistory();
    const [loading, setLoading] = useState(false)
    const userProfile = user?.profile;
    
    const jobCreate = async ( callback ) => {

        if(userProfile) {
            setLoading(true)
            const jobObj = {
                owner: user?.profile,
                user: user?._id,
                participants:[userProfile]
            }
            const res = await Api.post('job/create',jobObj);
            setLoading(false)
    
            if(res?.data){
                const job = res.data
                setJobs([job])
                if(callback){
                    callback(job)
                }else{
                    const path = '/dashboard/edit/job/' + job?._id;
                    history.push(path)
                }
    
            }
        }

    }

    const jobEdit = async (jobObj, callback) => {
        setLoading(true)
        const res = await Api.post('job/update',jobObj);
        setLoading(false)
        
        if(res?.data){
            const job = res.data
            setJobs([job])
            callback(job)
        }
    }

    const setJobs = async (jobs) => {

        const jobDict = dashboard.jobDictionary;
        const jobIds = dashboard.jobIds;
    
        const {
            newDict, idArr
        } = arrayToReducer(jobs)
    
        dispatch({
            type: 'AddDashboard',
            payload:{
                jobDictionary:{
                    ...jobDict,
                    ...newDict,
                },
                jobIds: Array.from(new Set([...jobIds, ...idArr])),
            }
        })
    
    }

    const getJobDetail = async (jobId) => {
        setLoading(true)
        const res = await Api.post('job/getDetail', {jobId})

        setLoading(false)
        
        if(res?.data){
            const data = res.data
            setJobs([res.data])
            return data
        }else{
            return null
        }
    }

    return {
        jobEdit,
        jobCreate,
        setJobs,
        getJobDetail,
        loading
    }
}

