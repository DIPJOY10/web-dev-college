import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Basic from './basic.setting';
import Qualification from './qualification.form';
import AttachFiles from './attach.files';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '6rem',
  },
}));


function getSteps() {
  return ['Basic', 'Qualifications', 'Attach Files'];
}


const EditOrgJob = (props)=>{
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  let stepView = <Basic {...props}/>;

  switch (activeStep) {
    case 0:
      stepView = <Basic {...props} setActiveStep={setActiveStep} />;
      break;

    case 1:
      stepView = <Qualification
        setActiveStep={setActiveStep}
      />;
      break;

    case 2:
      stepView = <AttachFiles
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

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>

      </Stepper>
    </div>
  );
};

export default EditOrgJob;
