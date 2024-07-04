import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import renderHTML from 'react-render-html';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory, useLocation } from 'react-router-dom';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import WorkIcon from '@material-ui/icons/Work';
import Typography from '@material-ui/core/Typography';
import RoomIcon from '@material-ui/icons/Room';
import moment from 'moment';
import PayType from './payType';
import { useJob } from './job.hook';
import Chip from '@material-ui/core/Chip';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import ContractorIcon from '../../Assets/contractor.svg';
import GoogleMap from '../../Assets/google-maps.png';
import Description from '../styled/DataDisplay/description';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import Api from '../../helpers/Api';
import CircularProgress from "@material-ui/core/CircularProgress";
import JobApplicationView from './job.application.view';
import FileObjectViewer from '../file/Viewer/FilesObjectViewer';
import AvatarLocal from '../profile/avatar';
// import useGetAdminProfiles from '../../profile/useGetAdminProfiles';
// import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    width: '75%',
    // minHeight: '23vh',
    margin: '1vh',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    // border: '1px solid red',
    // padding: '1rem',

    // paddingBottom: '0.2rem',
  },
  root_Container: {
    width: '100%',
    // minHeight: '100%',
    // border: '1px solid black',
    display: 'flex',
    flexDirection: 'column',
    alignItems: "center",
    // justifyContent: 'center',

  },
  parent_Container: {
    width: '100%',
    // minHeight: '80%',
    // border: '1px solid green',
    padding: '2vh 1vw',
    [theme.breakpoints.down('xs')]: {
      padding: '2vh 2vw',
    },

  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    // border: '1px solid red',
    alignItems: 'flex-start'

  },
  img: {
    height: '40px',
    width: '40px',
    borderRadius: '20px',
    marginRight: '10px',
  },
  title: {
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    // border: '1px solid blue',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '2vh 3.3vw 0 3.3vw'
  },
  experience: {
    display: 'flex',
    flexDirection: 'column',
  },
  payType: {
    display: 'flex',
    flexDirection: 'column',

  },
  salary: {
    display: 'flex',
    flexDirection: 'column',

  },
  skills: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    // border: '1px solid red',
    // width: '80%',
    margin: '1vh 3.3vw 0 3vw',
    // [theme.breakpoints.down('xs')]: {
    //   flexDirection: 'column'
    // }
    // marginTop: '1vh'
  },
  published: {
    width: '100%',
    backgroundColor: '#f2f2f0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1vh 1vw',
    [theme.breakpoints.down('xs')]: {
      padding: '1vh 2vw',
    },
  },
  applicationpayType: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    // border: '1px solid red',
    margin: '0 0 2vh 0'
  },
  applicationcomment: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    // border: '1px solid red',
    margin: '0 0 2vh 0'
  },
  applicationfiles: {
    display: 'flex',
    flexDirection: 'column',
    width: '70%',
    // border: '1px solid red',
    // margin: '0 0 2vh 0'
  }
  // svgSize: {
  //   display: 'flex',
  //   height: '40px',
  //   width: '40px',
  //   borderRadius: '20px',
  //   marginRight: '10px',
  // },

  // mapSize: {
  //   display: 'flex',
  //   height: '30px',
  //   width: '30px',
  //   marginTop: '10px',
  // },

  // title: {
  //   fontSize: 14,
  //   marginLeft: 15,
  // },

  // reviewChip: {
  //   height: '1.2rem',
  //   padding: 0,
  //   marginLeft: '0.3rem',
  // },

  // catChip: {
  //   backgroundColor: theme.palette.primary.light,
  //   height: '1.2rem',
  //   padding: 0,
  //   marginLeft: '0.3rem',
  //   color: 'white',
  // },

  // rowDiv: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'row',
  //   flexWrap: 'wrap',
  // },

  // locDiv: {
  //   display: 'flex',
  //   flexDirection: 'row',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '10rem',
  //   maxWidth: '10rem',

  //   [theme.breakpoints.down('xs')]: {
  //     flexDirection: 'column',
  //     width: '8rem',
  //     maxWidth: '8rem',
  //   },
  // },

  // colDiv: {
  //   flex: 1,
  //   display: 'flex',
  //   flexDirection: 'column',
  // },
}));

export default function JobCard(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const dashboard = useSelector((state) => state.dashboard);
  const { jobCatDictionary } = dashboard;
  const { jobId, page } = props;
  const { job, isFeed } = useJob(jobId);
  // const [btnComponentState, setBtnComponentState] = useState(<BookmarkBorderIcon />);
  const { auth } = useSelector((state) => state);
  const { user } = auth;
  const profile = user?.profile;
  const userId = user?._id;
  let appState = [];
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setIsLoading] = useState(false);
  // const [appState, setAppState] = useState(null);
  // const [savedIds, setSavedIds] = useState(null);
  useEffect(() => {
    Api.post('job/getSavedJobs', {
      profile, user
    }).then((res) => {
      for (const values of Object.values(res)) {
        if (values?.parent === jobId)
          setIsSaved(true);
      }
      // console.log(savedIds, 'savedJobs');
      // }
    })
  }, [profile, user, setIsSaved])
  const getAppliedDetails = async (profile, jobId) => {
    Api.post('/apply/getAppliedDetails', {
      profile, modelId: jobId
    }).then((res) => {
      // console.log(res?.apps, "AppliedDetails")
      appState = [...res?.apps];
      // setAppState(res?.apps);
      console.log(appState[0], "AppliedDetails");
    })

  }
  useEffect(() => {
    getAppliedDetails(profile, jobId);
  }, [profile, jobId])

  // console.log(job,' is the job',jobId)
  const history = useHistory();
  const saveJob = async () => {
    setIsLoading(true)
    const save = await Api.post("save/create", {
      parent: job?._id,
      parentModelName: "Job",
      user,
      profile,
    });
    console.log("jobSave", save);
    if (save.save) {
      setIsSaved(true);
      dispatch({
        type: "AddApiAlert",
        payload: {
          success: true,
          message: "Job is saved successfully",
        },
      });
      setIsLoading(false);
      // setBtnComponentState(<BookmarkBorderIcon />);
    } else {
      setIsSaved(false);
      dispatch({
        type: "AddApiAlert",
        payload: {
          success: false,
          message: "Job unsaved",
        },
      });
      setIsLoading(false);
      // setBtnComponentState(<BookmarkIcon />);
    }
    // if (!isSaved) {
    //   setIsSaved(true);
    // }
    // else if (isSaved) {
    //   setIsSaved(false);
    // }

  }
  if (job != undefined)
    return (
      <Paper
        className={classes.root}
        square
      >
        <div className={classes.root_Container}>
          <div className={classes.parent_Container}
            onClick={() => {
              if (isFeed) {
                const path = '/feed/job/' + jobId;
                history.push(path);
              }
              else {
                if (job?.published) {
                  console.log(job, "This is the job");
                  const path = '/dashboard/job/apply/' + jobId;
                  // const path = '/dashboard/job/manage/' + jobId;
                  history.push(path, { state: jobId });
                }
                else {
                  const path = '/dashboard/edit/job/' + jobId;
                  history.push(path);
                }
              }
            }}
          >
            {/* <h1>Parent Container</h1> */}
            <div className={classes.titleContainer}>
              <img key={'job'} className={classes.img} src={job?.owner?.parent?.displayPicture?.thumbUrl} />
              <div className={classes.title}>
                <Typography variant="h6">{job?.title}</Typography>
                <Typography variant="body2">{`${job?.organization ? job?.organization : job?.owner?.parent?.displayName} - ${job?.location?.name}`}</Typography>
              </div>
            </div>
            <div className={classes.details}>
              <div className={classes.experience}>
                <Typography variant="body2">Experience</Typography>
                <Typography variant="subtitle2">Above {job?.experience}yrs</Typography>
              </div>
              <div className={classes.payType}>
                <Typography variant="body2">PayType</Typography>
                <Typography variant="subtitle2">{job?.payType}</Typography>
              </div>
              <div className={classes.salary}>
                <Typography variant="body2">Salary</Typography>
                <Typography variant="subtitle2">{job?.payType === "Negotiable" ? ("$" + job?.negoMin + " - " + "$" + job?.negoMax) : ((job?.payType === "Hourly") ? "$" + job?.hourly : "$" + job?.fixed)}</Typography>
              </div>
            </div>
            <div className={classes.skills}>
              {job?.categories.map((categories) => {
                return <Chip label={categories?.name} size="small" variant="outlined" style={{ margin: '0 .5vw 1vh 0' }} />;
              })}
            </div>
            {page === "Applied" ? <div className={classes.applyDetails}>
              <Typography variant="h6">Applied Details</Typography>
              <Paper className={classes.paper}>
                {appState.length == 0 ? <CircularProgress /> : <><div className={classes.parentContainer}>
                  <AvatarLocal src={appState[0]?.profile?.parent} style={{ marginBottom: '1vh' }} />
                  <Typography variant="h6">{appState[0]?.profile?.parent?.displayName}</Typography>
                </div>
                  <div className={classes.applicationpayType}>
                    <Typography variant="h6">Salary</Typography>
                    <Typography variant="subtitle1">{(job?.payType === 'Negotiable') ? `${job?.payType} - ${appState[0]?.payType?.negoMin} - ${appState[0]?.payType?.negoMax}` : ((job?.payType === 'Hourly') ? `${job?.payType} - ${appState[0]?.payType?.hourly}` : `${job?.payType} - ${appState[0]?.payType?.fixed}`)}</Typography>
                  </div>
                  <div className={classes.comment}>
                    <Typography variant="h6">Comment</Typography>
                    <Typography variant="subtitle1">{appState[0]?.message}</Typography>
                  </div>
                  <div className={classes.files}>
                    <Typography variant="h6" style={{ marginBottom: '1vh' }}>Files Uploaded</Typography>
                    {/* <FilesViewer fileIds={appState[0]?.files} /> */}
                    <FileObjectViewer files={appState[0]?.files} styleBody={{
                      width: "25px",
                      height: "25px",
                      margin: "0",
                      borderRadius: "0",
                      // border: "1px solid lightgrey",
                      padding: "0",
                    }} isGallery={true} />
                  </div></>}
              </Paper>

            </div> : null}
          </div>
          <div className={classes.published}>
            <div>
              <Typography variant="caption">Posted on {moment(job?.publishedAt).format('DD MMM YYYY')}</Typography>
            </div>
            {page === "Applied" ? null : <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 'fit-content', width: 'fit-content' }} onClick={saveJob}>
              {loading ? <CircularProgress size={25} /> : <><IconButton size="small">
                {!isSaved ? (
                  <BookmarkBorderIcon />
                ) : (
                  <BookmarkIcon />
                )}
              </IconButton>
                <Typography variant="subtitle1">{isSaved ? 'Saved' : 'Save'}</Typography></>}
            </div>}
          </div>
        </div>
        {/* <div className={classes.rowDiv}>
          <div className={classes.colDiv}>
          <div className={classes.rowDiv}>
          <div className={classes.rowDiv}>
          <div className={classes.colDiv}>
                  <Typography variant="body2" component="p">
                    <b>{job?.title}</b>
                  </Typography>
                  <Typography variant="caption">published at {moment(job?.publishedAt).format('DD MMM YYYY')}</Typography>
                  {min ? null : (
                    <>
                      <PayType jobId={jobId} />
                  * <div className={classes.rowDiv}>

                                                          {job?.categories.map(catId=>{
                                                              var cat = jobCatDictionary[catId]
                                                              return (
                                                                  <Chip
                                                                      label={cat.name}
                                                                      className={classes.catChip}
                                                                  />
                                                              );
                                                          })}
                                                      </div> 
                    </>
                  )}
                </div>
              </div>

              <div className={classes.locDiv}>
                <Typography variant="caption" display="block">
                  {job?.location?.name}
                </Typography>
                <img className={classes.mapSize} src={GoogleMap} />
              </div>
            </div>

            
            {job?.description.length > 200 ? job?.description.slice(0, 200).split(' ').slice(0, -1).join(' ') + ' ...' : job?.description}
            
          </div>
        </div> */}

      </Paper >
    );
  else
    return null;
}
