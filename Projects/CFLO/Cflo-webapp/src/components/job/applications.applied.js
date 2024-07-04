import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import Api from '../../helpers/Api';
import JobCard from './job.card';
import CircularProgress from '@material-ui/core/CircularProgress';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },

}));
export default function ApplicationsApplied() {
    const classes = useStyles();
    const { auth } = useSelector((state) => state);
    const { user } = auth;
    const userId = user?.profile;
    const [appliedJobs, setAppliedJobs] = useState(null);
    const [loading, setIsLoading] = useState(true);
    const parentModelName = "Job";
    useEffect(() => {
        Api.post('apply/getApplications', {
            userId, parentModelName
        }).then((res) => {
            setAppliedJobs(res);
            setIsLoading(false);
            console.log(appliedJobs, "Parent");
        })
    }, [userId, appliedJobs])
    const JobCards = (jobIds) => {
        if (jobIds && jobIds.length > 0) {
            return jobIds.map((job) => {
                if (job) {
                    return (
                        <JobCard jobId={job?.parent?._id} />
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
        <div className={classes.root}>{loading ? <CircularProgress /> : <>{JobCards(appliedJobs)}</>}</div>
    )
}
