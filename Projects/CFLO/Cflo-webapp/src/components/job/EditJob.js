import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import EditOrgJob from './EditOrgJob';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import EditProjectJob from './EditProjectJob';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory,
} from 'react-router-dom';
import Api from '../../helpers/Api';
import useGetAdminProfiles from '../profile/useGetAdminProfiles';
import ProfileAppbar from '../profile/profile.appbar';
import { useJobApi } from './job.hooks';
import createLogo from '../../Assets/create1.png'
import { Button, useMediaQuery } from '@material-ui/core';
// import Edit_Project_Job from './edit.project.job';
import IconButton from '@material-ui/core/IconButton';
import DoneIcon from "@material-ui/icons/Done";
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: '6rem',
    paddingTop: '4rem',
    overflow: 'auto',
  },
  btn_container: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    // border: "1px solid red",
    alignItems: "center",
    // marginBottom: "2vh",
  },
  jobBtn: {
    borderRadius: "5vw",
    width: "15vw",
    height: "5vh",
    border: "2px solid",
  },
}));

const EditJob = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const { jobId } = useParams();
  const theme = useTheme();
  const dashboard = useSelector((state) => state.dashboard);
  const jobDictionary = dashboard?.jobDictionary;
  const { user } = useSelector((state) => state.auth);
  const oldJob = jobDictionary[jobId] || null;
  const [job, setJob] = useState(oldJob);
  const [reviewData, setreviewData] = useState({
    owner: null,
    title: null,
    subject: null
  })
  const oldOwner = job?.owner?.parent ? job?.owner?.parent : user;
  const oldTitle = job?.title ? job?.title : '';
  const [owner, setOwner] = useState(oldOwner);
  const [title, setTitle] = useState(oldTitle);
  const oldSubject = job?.subject ? job?.subject : null;
  const [subject, setSubject] = useState(oldSubject)
  const [isDisabled, setIsDisabled] = useState(true);
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  // const { loading } = useJobApi();

  const {
    adminProfiles
  } = useGetAdminProfiles()

  let JobView = null

  const {
    jobCreate, jobEdit, getJobDetail, loading
  } = useJobApi()

  const getDetail = async () => {
    console.log('getJobDetail getting called')
    const apiRes = await getJobDetail(jobId)
    console.log('apiRes ', apiRes)
    if (apiRes) {
      setJob(apiRes)
    }
  }


  useEffect(() => {
    getDetail()
  }, [jobId])


  const getJob = async () => {
    const res = await Api.post('job/getDetail', { jobId })
    const data = res?.data

    if (data) {
      setJob(data)
    }
  }

  useEffect(() => {
    getJob()
  }, [jobId])
  const _update = () => {
    const newJobObject = {
      _id: job?._id,
      status: 'Review Pending',
    }
    jobEdit(newJobObject, (jobRes) => {
      // setActiveStep(2);
      setJob(jobRes)
    })
  };
  return (
    <div className={classes.root}>
      <ProfileAppbar
        name={"Job Draft"}
        btns={
          <>
            {isMobile ? <IconButton onClick={() => {
              _update();

              history.goBack();
            }}
              disabled={!(reviewData?.owner && reviewData?.title && reviewData?.subject)}
              color="primary"
            >
              <DoneIcon fontSize="large" />
            </IconButton> : <Button variant="outlined" className={classes.jobBtn} color="primary" disabled={!(reviewData?.owner && reviewData?.title.length > 3 && reviewData?.subject)} onClick={() => {
              // setisDisabled(!isDisabled ? loading : null);
              _update();
              history.goBack();
            }}>
              {/* <img src={createLogo} alt="" /> */}
              Submit for review
            </Button>}

          </>
        }
      />
      {/* <div className={classes.btn_container}>

      </div> */}
      {/* <Edit_Project_Job
        {...props}
        reviewData={reviewData}
        setreviewData={setreviewData}
        setisDisabled={setisDisabled}
        adminProfiles={adminProfiles}
        history={history}
        job={job}
        setJob={setJob}
        jobEdit={jobEdit}
      /> */}
      <EditProjectJob
        {...props}
        reviewData={reviewData}
        setreviewData={setreviewData}
        setisDisabled={setIsDisabled}
        adminProfiles={adminProfiles}
        history={history}
        job={job}
        setJob={setJob}
        jobEdit={jobEdit}
      />

      {/* {JobView} */}
    </div>
  )
};

export default EditJob;
