import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import JobCard from './job.card';
import CircularProgress from '@material-ui/core/CircularProgress';
import Api from '../../helpers/Api';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
}));

export default function SavedJobs() {
    const classes = useStyles();
    const { auth } = useSelector((state) => state);
    const { user } = auth;
    const profile = user?.profile;
    // let savedJobsArr = [];
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setIsLoading] = useState(true);
    useEffect(() => {

        Api.post('job/getSavedJobs', {
            profile, user
        }).then((res) => {
            setSavedJobs(res);
            // for (const values of Object.values(res)) {
            //     savedJobsArr.push(values?.parent);
            // }
            setIsLoading(false);
            console.log(savedJobs, 'savedJobs');
            // }
        })
    }, [profile, user, savedJobs])
    const JobCards = (jobIds) => {
        if (jobIds && jobIds.length > 0) {
            return jobIds.map((job) => {
                if (job) {
                    return (
                        <JobCard jobId={job?.parent} />
                    );
                }
                else {
                    return null;

                }
            });
        }
        else {
            return null;
        }
    };
    return (
        <div className={classes.root}>
            {loading ? <CircularProgress /> : <>{JobCards(savedJobs)}</>}
        </div>
    )
}
