import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
// import renderHTML from 'react-render-html';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Container, Button, useTheme } from '@material-ui/core';
import { useLocation } from "react-router-dom";
import { useJob } from './job.hook';
import moment from 'moment';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';
import SkillsList from './skills.list';
import FileUploadButton from '../file/Uploader/FileUploadButton';
import ProfileSelect from '../styled/profile.select';
import useGetAdminProfiles from '../profile/useGetAdminProfiles';
import CreateButton from '../styled/actionBtns/create.btn';
import LoadingButton from '../styled/actionBtns/loading.btn';
import { useGetApps } from '../apply/apply.hooks';
// import FileObjectViewer from '../file/Viewer/FilesObjectViewer';
import Api from '../../helpers/Api';
import ProfileAppbar from '../profile/profile.appbar';
import ProfileSelectButton from '../styled/actionBtns/profileSelect.btn';
const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        // marginTop: '5vh',
        // height:'100%'
        // border: '1px solid green',
        alignItems: "center",
    },
    root_Container: {
        display: "flex",
        flexDirection: "column",
        width: "90%",
        // height: '90vh',
        // border: '1px solid green',
        alignItems: "center",
        paddingTop: "2vh",
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            // height: '80vh'
        },
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        // border: '1px solid red',
        width: '92%',
        height: '30vh',
        justifyContent: 'space-evenly',
        borderBottom: '1px solid grey',
    },
    importantDetails: {
        width: '60%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            marginBottom: '1vh'
        },

    },
    location: {
        display: 'flex',
        flexDirection: 'row',
        width: "70%",
        [theme.breakpoints.down('xs')]: {
            width: "100%",
            margin: '1vh 0'
        },
    },
    jobDescription: {
        display: 'flex',
        flexDirection: 'Column',
        width: '92%',
        // height: '6vh',
        justifyContent: 'space-between',
        margin: '2vh 0',
        [theme.breakpoints.down('xs')]: {
            margin: '1vh 0'
        }
    },
    skills: {
        display: 'flex',
        flexDirection: 'column',
        width: '92%',
        // minHeight: '8vh',
        justifyContent: 'space-between',
        // border: '1px solid red',
        [theme.breakpoints.down('xs')]: {
            // height: '20vh',
            // marginTop: '1vh',
        },
    },
    skills_list: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // width: '100%'
        flexWrap: 'wrap',
        width: 'fit-content',
        marginTop: '1vh',
        [theme.breakpoints.down('xs')]: {
            flexDirection: 'column',
            // justifyContent: 'space-evenly',
            height: '100%',
        },
    },
    experience: {
        display: 'flex',
        flexDirection: 'Column',
        width: '92%',
        height: '6vh',
        justifyContent: 'space-between',
        margin: '2vh 0 0 0'
    },
    subject: {
        display: 'flex',
        flexDirection: 'column',
        width: '92%',
        height: '6vh',
        justifyContent: 'space-between',
        margin: '2vh 0 4vh 0',
        [theme.breakpoints.down('xs')]: {
            margin: '2vh 0',
        }
    }

}));
export default function JobApply(props) {
    const classes = useStyles();
    const history = useHistory();
    let location = useLocation();
    const theme = useTheme();
    let jobId = location.pathname.substring(21);
    let job = useJob(jobId);
    job = job?.job;
    const { user } = useSelector((state) => state.auth);
    // console.log(job?.subject, "SUBJECT");
    const [owner, setOwner] = useState(null)
    const [btn, setBtn] = useState('Apply');
    const [btnState, setBtnState] = useState(true);
    const [loading, setLoading] = useState(true);
    const [text, setText] = useState("");
    const {
        adminProfiles
    } = useGetAdminProfiles()
    console.log(adminProfiles, "AdminProfiles")
    // useEffect(() => {
    //     const ownerOld = job?.owner || null;
    //     setOwner(ownerOld);
    // }, [job])
    // const auth = useSelector((state) => state.auth);
    // const { user } = auth;
    // const res = useGetApps(user?.profile, 'Job');
    // let parent = user?._id;
    // let model = 'Job';
    // let res = null;
    // useEffect(() => {
    const [userId, setUserId] = useState(null);
    // const getApplications = (parent, model) => {
    //     Api.post('apply/getApps', {
    //         parent, model,
    //     }).then((res) => {
    //         const {
    //             apps,
    //         } = res;
    //         setBtn(apps.length > 0 ? 'Already Applied!!!' : 'Proceed');
    //         console.log(res, 'Response');
    //     });
    // }
    useEffect(() => {
        console.log(btnState, "BtnState");
    }, [btnState])
    const isApplied = (res) => {
        let flag = -1;
        // let match = false;

        for (const values of Object.values(res)) {
            console.log(job?.owner?._id, owner?.profile, "Matching");
            if (job?.owner?._id === owner?.profile) {
                // setText("Owner cannot apply!!!");
                // setBtnState(false);
                flag = 0;
                break;
            }
            else if (jobId === values?.parent) {
                // match = true;
                // setText('Already Applied!!!');
                flag = 1;
                // setBtnState(true);
                break;
            }
            else {
                // setText("");
                flag = 2;

                // break;
            }
        }

        if (flag === 0)
            setText("Owner cannot apply!!!");
        else if (flag === 1)
            setText('Already Applied!!!');
        else if (flag === 2) {
            setText("");
            history.push({
                pathname: `/dashboard/job/apply/${jobId}/applyform/${userId}`
            });
        }
        setLoading(false);
        // setBtnState(false);
    }
    const getProfileApps = (profileIds) => {
        setLoading(true);
        Api.post('apply/getProfileApps', {
            profileIds
        }).then((res) => {
            console.log(res?.apps, "Applications");
            isApplied(res?.apps);
        })
    }
    // useEffect(() => {
    //     getApplications(jobId, 'Job');
    // }, [jobId])
    // const isAppsExist = (userId, model, parent) => {
    //     Api.post('apply/isAppsExist', {
    //         userId,
    //         model,
    //         parent
    //     }).then((res) => {
    //         setBtn(res ? 'Already Applied!!!' : 'Proceed');
    //         console.log(res, 'Response');
    //     });
    // }
    useEffect(() => {
        getProfileApps(userId);
    }, [userId])
    // }, [parent, model]);
    return (
        <>
            <ProfileAppbar
                name={"Job Details"}
                btns={
                    <>
                        <ProfileSelectButton
                            owner={owner}
                            adminProfiles={adminProfiles}
                            displayOwner={true}
                            loading={loading}
                            setLoading={setLoading}
                            // title={'Select Profile'}
                            onChange={(value) => {
                                setOwner(value);
                                console.log('valueisOwner ', value)
                                // userId = value?._id
                                setUserId(value?.profile);
                                // isAppsExist(userId, "Job", jobId);
                                // setBtnState(false);
                                // history.push(`/dashboard/job/apply/${jobId}/applyform`)
                            }}
                            placeholder={'Job proposal owner'}
                            text={text}
                        />
                        {/* <LoadingButton
                            loading={loading}
                            styleBody={{
                                height: "35px",
                                borderRadius: "20px",
                                padding: "5.5px 15px",
                            }}
                            text={btn}
                            onClick={() => {
                                if (btn === 'Proceed') {
                                    props.history.push({
                                        pathname: `/dashboard/job/apply/${jobId}/applyform/${userId}`,
                                        owner
                                    });
                                }
                                // else if (btn === 'Already Applied!!!')
                                // history.push(`/dashboard/jobs`);
                                // setBtnState(true);
                            }}
                            disabled={btnState}
                            style={
                                {
                                    backgroundColor: theme.palette.primary.light,
                                    color: "white",
                                    marginBottom: '2vh'
                                }
                            }
                            progressStyle={{ color: "white" }}
                        >

                            {btn}
                            {/* {console.log(btn, "Apps")} */}
                        {/* </LoadingButton> */}
                    </>
                }
            />


            <div className={classes.root}>
                {/* <Typography variant="h4" style={{ fontWeight: '500', marginBottom: '3vh' }}>{job?.title} {`posted by ${(job?.owner?.parent?.displayName) ? job?.owner?.parent?.displayName : "XYZ organization"}`}</Typography> */}
                {/* <Typography variant="h4"></Typography> */}
                <Paper className={classes.root_Container}>
                    <div className={classes.container}>
                        <div>
                            <Typography variant="body1" style={{ fontWeight: '500' }}>{job?.title}</Typography>
                            <Typography variant="body1" style={{ color: 'grey' }}>{(job?.organization) ? job?.organization : "XYZ organization"}<br /></Typography>
                            <Typography variant="body1" style={{ color: 'grey' }}>{`Posted by ${job?.owner?.parent?.displayName}`}<br /></Typography>
                        </div>
                        <div className={classes.location}>
                            <LocationOnOutlinedIcon />
                            {job?.location?.name.length > 0 ? <Typography variant="body1">{job?.location?.name}</Typography> : "Location not specified"}
                        </div>
                        <div className={classes.importantDetails}>
                            <div>
                                <Typography variant="body1" style={{ color: "grey" }}>Start Date</Typography>
                                <Typography variant="body1">{moment(job?.startDate).format('DD MMM YYYY')}</Typography>
                            </div>
                            <div>
                                <Typography variant="body1" style={{ color: "grey" }}>PayType</Typography>
                                <Typography variant="body1">{job?.payType}</Typography>

                            </div>
                            <div>
                                <Typography variant="body1" style={{ color: "grey" }}>Salary</Typography>
                                <Typography variant="body1">{job?.payType === "Negotiable" ? ("$" + job?.negoMin + " - " + "$" + job?.negoMax) : ((job?.payType === "Hourly") ? "$" + job?.hourly : "$" + job?.fixed)}</Typography>
                            </div>
                        </div>
                    </div>
                    <div className={classes.jobDescription}>
                        <Typography variant='body1' style={{ fontWeight: "500" }}>Job Description</Typography>
                        {job?.description.length != 0 ? <Typography variant='subtitle1'>{job?.description.substring(3, (job?.description).length - 4)}</Typography> : "No Description"}
                        {/* {renderHTML(job?.description)} */}
                    </div>
                    <div className={classes.skills}>
                        <Typography variant="body1" style={{ fontWeight: "500" }}>Skill(s) Required</Typography>
                        {job?.categories?.length > 0 ? <div className={classes.skills_list}>
                            {job?.categories.map((categories) => {
                                return <SkillsList skill={categories?.name} />;
                            })}
                        </div> : "No Skills specified"}
                    </div>
                    <div className={classes.experience}>
                        <Typography variant='body1' style={{ fontWeight: "500" }}>Experience</Typography>
                        <Typography variant='subtitle1'>{`Minimum ${job?.experience}yrs`}</Typography>
                    </div>
                    <div className={classes.subject}>
                        <Typography variant='body1' style={{ fontWeight: "500" }}>Subject</Typography>
                        <Typography variant='subtitle1'>{job?.subject?.parent?.displayName}</Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* <Button style={{ color: 'white', marginBottom: '2vh' }} variant='contained' color='primary'
                        // onClick={() => {
                        //     history.push(`/dashboard/job/apply/${jobId}/applyform`);
                        // }}
                        > */}
                        {/* Apply Now */}
                        {/* <ProfileSelectButton
                            owner={owner}
                            adminProfiles={adminProfiles}
                            displayOwner={true}
                            // title={'Select Profile'}
                            onChange={(value) => {
                                setOwner(value);
                                console.log('valueisOwner ', value)
                                // userId = value?._id
                                setUserId(value?.profile);
                                // isAppsExist(userId, "Job", jobId);
                                // setBtnState(false);
                                // history.push(`/dashboard/job/apply/${jobId}/applyform`)
                            }}
                            placeholder={'Job proposal owner'}
                        /> */}
                        {/* </Button> */}
                        {/* <LoadingButton
                            loading={loading}
                            styleBody={{
                                height: "35px",
                                borderRadius: "20px",
                                padding: "5.5px 15px",
                            }}
                            text={btn}
                            onClick={() => {
                                if (btn === 'Proceed') {
                                    props.history.push({
                                        pathname: `/dashboard/job/apply/${jobId}/applyform/${userId}`,
                                        owner
                                    });
                                }
                                // else if (btn === 'Already Applied!!!')
                                // history.push(`/dashboard/jobs`);
                            }}
                            disabled={btnState}
                            style={
                                {
                                    backgroundColor: theme.palette.primary.light,
                                    color: "white",
                                    marginBottom: '2vh'
                                }
                            }
                            progressStyle={{ color: "white" }}
                        >

                            {btn}
                            {console.log(btn, "Apps")}
                        </LoadingButton> */}
                    </div>
                    {/* <FileUploadButton parentType="Message" used={false} parentId={null} /> */}
                    {/* <FileObjectViewer /> */}
                </Paper>
            </div>
        </>

    )
}
