import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import ProfileAppbar from '../profile/profile.appbar'
import JobCard from './job.card';
import { useLocation } from 'react-router-dom';
import FileUploadCard from '../file/Viewer/FileUploadCard';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import ApplyCreate from '../apply/apply.create';
const useStyles = makeStyles((theme) => ({
    root: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        marginBottom: "6rem",
        marginTop: "6rem",
        marginLeft: "4rem",
        marginRight: "4rem",
        [theme.breakpoints.down("sm")]: {
            marginLeft: "1rem",
            marginRight: "1rem",
        },
    }
}))

export default function JobApplyForm() {
    const classes = useStyles();
    const location = useLocation();
    let jobId = location.pathname.substring(21, location.pathname.length - 35);
    let userId = location.pathname.substring(56);
    return (
        <>
            <div className={classes.root}>
                <ProfileAppbar
                    name={"Applications"}
                />
                <JobCard jobId={jobId} />
                {/* <FileUploadButton /> */}
                <ApplyCreate />

            </div>
        </>
    )
}
