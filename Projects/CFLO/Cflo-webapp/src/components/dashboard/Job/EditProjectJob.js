import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';

import BasicForm from './basic';
import PropForm from './prop.form';
import QualForm from './qual.form';
import AttachFiles from './attach.files';
import Button from '@material-ui/core/Button';
import {evaluateProjectStep} from './job.utils';
import Topbar from './topbar';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
  },
}));


function getSteps() {
  return ['Basic', 'Qualifications', 'About Project'];
}


const EditProjectJob = (props)=>{
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);


  const {job, setJob, adminProfiles } = props;


  const steps = getSteps();
  let stepView = <BasicForm {...props}/>;


  useEffect(() => {
    const step = evaluateProjectStep(job);
    setActiveStep(step);
  }, []);


  switch (activeStep) {
    case 0:
      stepView = <BasicForm
        {...props}
        setActiveStep={setActiveStep}
        job={job}
        setJob={setJob}
        adminProfiles={adminProfiles}
      />;
      break;

    case 1:
      stepView = <QualForm
        {...props}
        setActiveStep={setActiveStep}
      />;
      break;

    case 2:
      stepView = <PropForm
        {...props}
        setActiveStep={setActiveStep}
      />;
      break;


    default:
      break;
  }


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  useEffect(() => {

  }, [job]);

  const getButtons = ()=>{
    switch ( activeStep ) {
      case 0:
        return (
          <div className={classes.rowDiv}>
            <Button variant="contained" color="primary" disableElevation disabled={true} onClick={handleNext}>
                        Qualifications
            </Button>
          </div>
        );
        break;

      case 1:
        return (
          <div className={classes.rowDiv}>
            <Button variant="contained" color="primary" disableElevation disabled={true} onClick={handleBack}>
                        Basic
            </Button>
            <Button variant="contained" color="primary" disableElevation disabled={false} onClick={handleNext}>
                        About Project
            </Button>
          </div>
        );
        break;

      case 2:

        break;

      default:
        break;
    }
  };


  return (
    <div className={classes.root}>
      <Topbar
        job={job}
      />
      <Stepper nonLinear activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={()=>setActiveStep(index)}>
              {label}
            </StepButton>
            <StepContent>
              {stepView}
            </StepContent>
          </Step>
        ))}
      </Stepper>

    </div>
  );
};

export default EditProjectJob;
