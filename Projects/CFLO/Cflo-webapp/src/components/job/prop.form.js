import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Api from '../../helpers/Api';
import DescriptionInput from '../styled/description.input';
import HandleJobCat from '../styled/handle.job.cat';

import CreateBtn from '../styled/actionBtns/create.btn';
import TextField from '@material-ui/core/TextField';
import NumberInput from '../styled/number.input';
import HandlePropCat from '../styled/handle.prop.cat';
import ChooseDialog from "../choose/index";
import UserListItem from "../choose/user.list.item";
import configObject from "../../config/index";
import FileUploadButton from '../file/Uploader/FileUploadButton';
import arrayToReducer from '../../helpers/arrayToReducer';
import _ from 'lodash';
import LoadingButton from '../styled/actionBtns/loading.btn';
import FilesViewer from '../file/Viewer/FilesViewer';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    },
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
  },
  row2: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    // border: '1px solid blue',
    width: '50%',
    [theme.breakpoints.down('xs')]: {
      // border: '1px solid red',
      width: '100%'
    },

  },

  card2Style: {
    marginTop: '1.5rem',
  },

  container: {
    flex: 1,
    flexDirection: 'row',
    display: 'flex',
    marginTop: '3vh',
    // maxWidth: '32rem',
    width: '80%',
    justifyContent: 'space-between',
    alignItems: 'center',
    // border: '1px solid red'
  },

  boxWidth: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '9rem',
    margin: '0.5rem',
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    margin: "0rem 1rem",
  },

}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    job, setJob, setActiveStep, jobEdit, reviewData, setreviewData, setisDisabled
  } = props;
  const theme = useTheme();
  const oldSubject = job?.subject ? job?.subject : null;
  const [subject, setSubject] = useState(oldSubject)
  const oldFiles = job?.files ? job?.files : null;
  const [files, setFiles] = useState(oldFiles);
  const oldFilesIds = oldFiles.map(files => files?._id);
  const [filesIds, setFilesIds] = useState(oldFilesIds);
  const [loading, setLoading] = useState(false);

  const {
    root, row, col, row2
  } = classes;

  // const _update = ()=>{
  //   Api.post('job/update', {
  //     _id: jobId,
  //     propertyTypes,
  //   }).then((job)=>{
  //     setJobs([job], dashboard, dispatch );
  //     setActiveStep(2);
  //   });
  // };
  const [filesDict, setFilesDict] = useState([])

  const addFiles = (newFiles) => {
    const {
      newDict, idArr
    } = arrayToReducer(newFiles)


    setFilesDict({
      ...filesDict, ...newDict
    })

    setFilesIds(Array.from(new Set([...filesIds, ...idArr])));

  }

  useEffect(() => {
    if (oldFiles && oldFiles.length > 0) {
      addFiles(oldFiles)
    }
    // if (oldSubject) {
    //   setSubject(oldSubject)
    //   setreviewData({
    //     owner: true,
    //     title: reviewData?.title,
    //     subject: subject
    //   });

    // }

  }, [oldFiles?.length, reviewData, setreviewData, subject, oldSubject, setSubject])

  const _update = () => {
    const newJobObject = {
      _id: job?._id,
      subject: subject._id,
      type: subject.parentModelName,
      files: filesIds
    }
    jobEdit(newJobObject, (jobRes) => {
      setActiveStep(2);
      setJob(jobRes)
      setLoading(false);
      setreviewData({
        owner: reviewData?.owner,
        title: reviewData?.title,
        subject: subject
      });
    })
  };

  return (
    <div className={root}>
      <div style={{
        // border: '1px solid red',
        width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'
      }}>
        <div className={col}>
          <div className={row2}>
            {subject?._id ? <UserListItem entity={subject?.parent} /> :
              <Typography className={row}>
                Choose Subject
              </Typography>
            }
            <ChooseDialog
              choosen={subject}
              setChoosen={setSubject}
            />
          </div>

          {subject?.parentModelName == 'Project' ?
            <Paper className={classes.paperStyle} onClick={() => {
              const url = configObject.BASE_URL + 'analysis/' + subject.parent.team
              const newWindow = window.open(url, "_blank", "noopener,noreferrer");
              if (newWindow) newWindow.opener = null;
            }}>
              To update the {subject.parentModelName} details, click
              here. Incomplete project description will lead to removal of your job
              post
            </Paper>
            : null}
        </div>
        <div className={col}>
          <div className={row2}>
            <Typography className={row2}>
              Add Files
            </Typography>
            <FileUploadButton
              parentType="Message"
              used={false}
              parentId={null}
              setFilesIds={setFilesIds}
            />
          </div>
          <FilesViewer fileIds={filesIds} />
        </div>

      </div>



      {/* <HandlePropCat
        propertyTypes={propertyTypes}
        setPropertyTypes={setPropertyTypes}
      />

      <div className={classes.col}>
        <Typography>
          <b>Area (sq/ft)</b>
        </Typography>
        <TextField id="standard-basic" type="number" value={area}
          helperText={'Total Project Area'}
          placeholder={area}
          onChange={(event) => {
            const target = Number(event.target.value);
            if (Number.isInteger(target)&&target>=0) {
              const str = String(event.target.value);

              const firstChar = String(event.target.value).slice(0, 1);

              if (firstChar.localeCompare('0')==0&&str.length>1) {
                setArea(str.slice(1));
              }
              else {
                setArea(str);
              }
            }
          }}/>
      </div> */}

      {/* <CreateBtn type="submit" color="primary" onClick={() => {
          _update();

          // (reviewData?.owner && reviewData?.subject && reviewData?.title) ? setisDisabled(false) : setisDisabled(true)
          setreviewData({
            owner: reviewData?.owner,
            title: reviewData?.title,
            subject: subject
          })
          console.log(reviewData?.owner, reviewData?.subject, reviewData?.title, "Review Data")
        }}>
          Save
        </CreateBtn> */}
      <div className={classes.container}>
        <CreateBtn type="submit" color="primary" onClick={() => {
          setActiveStep(1);
        }}>
          Back
        </CreateBtn>
        <LoadingButton
          loading={loading}
          styleBody={{
            height: "35px",
            borderRadius: "20px",
            padding: "5.5px 15px",
          }}
          text={'Save'}
          onClick={() => {
            setLoading(true);
            _update();
          }}
          style={
            {
              backgroundColor: theme.palette.primary.light,
              color: "white",
            }
          }
          progressStyle={{ color: "white" }}
        >

          Save
          {/* {console.log(btn, "Apps")} */}
        </LoadingButton>
      </div>
    </div>
  );
}
