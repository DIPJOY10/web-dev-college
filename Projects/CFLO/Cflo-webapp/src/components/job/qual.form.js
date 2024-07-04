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

import ManageCategory from '../categories/manage.categories';
import useGetJobTemplates from './useGetJobTemplates';
import TemplateAttach from '../issue/template.attach';
import StatusPicker from '../issue/status.picker';
import LoadingButton from '../styled/actionBtns/loading.btn';
const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    [theme.breakpoints.down('xs')]: {
      width: '90%'
    },
    // alignItems: 'center'
  },
  templateStatus: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: '4vw'
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
    width: '90%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
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
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
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
  const theme = useTheme();
  const {
    job, setJob, setActiveStep, jobEdit, isMobile
  } = props;
  console.log(job, ' is the jobInQualForm')
  const jobId = job?._id;

  const oldCats = job?.categories ? job?.categories : [];
  const oldCatIds = oldCats.map(cat => cat?._id);
  const oldWhoCanApply = job?.whoCanApply ? job?.whoCanApply : '';
  const oldExperience = job?.experience ? job?.experience : 1;
  const [catIds, setCatIds] = useState(oldCatIds);
  const [whoCanApply, setWhoCanApply] = useState(oldWhoCanApply);
  const [experience, setExperience] = useState(oldExperience);
  const [template, setTemplate] = useState(null);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const {
    root, row, col,
  } = classes;
  const {
    templateIds,
    setTemplateIds,
    templateDictionary,
    setTemplateDictionary,
  } = useGetJobTemplates(job?.owner?._id);
  const templates = [];
  templateIds.map((tempId) => {
    var temp = templateDictionary[tempId];
    // if (temp?.title === 'Job Default')
    //   setTemplate(temp);
    if (temp?._id) {
      templates.push(temp);
    }
    // setTemplate(templates[0]);
  });
  // useEffect(() => {
  //   console.log(job, "jobDetails")
  // }, [job])
  console.log(template, "temp");

  const _update = () => {
    const newJobObject = {
      _id: jobId,
      experience,
      whoCanApply,
      categories: catIds,
      template: template?._id
    }

    jobEdit(newJobObject, (jobRes) => {
      setActiveStep(2);
      setJob(jobRes)
    })
  };

  return (
    <div className={root}>
      {/* <HandleJobCat
        skillTags={catIds}
        setSkillTags={setCatIds}
      /> */}

      <ManageCategory
        cats={job?.categories || []}
        catIds={catIds}
        setCatIds={setCatIds}
      />


      <DescriptionInput
        isMobile={isMobile}
        hideTitle={true}
        description={whoCanApply}
        placeholder={'What are you looking for in applicant'}
        setDescription={setWhoCanApply}
      />
      <div className={isMobile ? classes.col : classes.row2}>
        <Typography className={classes.text}>
          <b>Template</b>
        </Typography>
        {/* <div className={classes.col}> */}
        <TemplateAttach
          profileId={job?.owner?._id}
          template={template}
          templates={templates}
          type='Job'
          platform={true}
          onSelect={(template) => {
            setTemplate(template);
            const pipeline = template?.pipeline || [];
            if (pipeline.length > 0) {
              let currentstatus = pipeline.filter(
                (obj) => obj?._id == status?._id
              );
              if (currentstatus.length == 0) {
                let startState = pipeline.filter(
                  (obj) =>
                    obj?._id ==
                    template?.startState
                )[0];
                if (startState?.length == 0) {
                  startState = pipeline[0];
                }
                setStatus(startState);
              }
            }
          }}
        />
        <div className={classes.templateStatus}>
          {template?.pipeline?.length > 0 ? (
            <StatusPicker
              pipeline={template?.pipeline}
              status={status}
              setStatus={setStatus}
            />
          ) : null}
          {/* </div> */}
        </div>
      </div>
      <div className={classes.col}>
        <Typography className={classes.text}>
          Minimum Experience (yr)
        </Typography>
        <NumberInput value={experience} setValue={(number) => {
          setExperience(number);
        }} />
      </div>

      <div className={classes.container}>
        <CreateBtn type="submit" color="primary" onClick={() => {
          setActiveStep(0);
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
          text={'Save and Next'}
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

          Save and Next
          {/* {console.log(btn, "Apps")} */}
        </LoadingButton>
      </div>
    </div>
  );
}
