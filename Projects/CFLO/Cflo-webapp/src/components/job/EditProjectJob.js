import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepButton from '@material-ui/core/StepButton';
import StepContent from '@material-ui/core/StepContent';

import BasicForm from './basic';
import PropForm from './prop.form';
import QualForm from './qual.form';

import Button from '@material-ui/core/Button';
import { evaluateProjectStep } from './job.utils';

import { useMediaQuery } from '@material-ui/core';
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '2rem',
    marginBottom: '6rem'
  },
}));


function getSteps() {
  return ['Basic', 'Qualifications', 'Subject'];
}


const EditProjectJob = (props) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);
  let theme = useTheme()

  const { job, setJob, adminProfiles, jobEdit, reviewData, setreviewData, setisDisabled } = props;
  const steps = getSteps();
  let stepView = <BasicForm {...props} />;
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));


  useEffect(() => {
    // const step = evaluateProjectStep(job);
    // setActiveStep(step);
  }, []);

  const getStepContent = (activeStep) => {
    switch (activeStep) {
      case 0:
        return <BasicForm
          {...props}
          reviewData={reviewData}
          setreviewData={setreviewData}
          setActiveStep={setActiveStep}
          job={job}
          setJob={setJob}
          adminProfiles={adminProfiles}
          jobEdit={jobEdit}
          isMobile={isMobile}
        />;
        break;

      case 1:
        return <QualForm
          {...props}
          reviewData={reviewData}
          setreviewData={setreviewData}
          job={job}
          setJob={setJob}
          setActiveStep={setActiveStep}
          jobEdit={jobEdit}
          isMobile={isMobile}
        />;
        break;

      case 2:
        return <PropForm
          {...props}
          reviewData={reviewData}
          setreviewData={setreviewData}
          setisDisabled={setisDisabled}
          setActiveStep={setActiveStep}
          job={job}
          setJob={setJob}
          isMobile={isMobile}
        />;
        break;


      default:
        break;
    }
  }


  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // useEffect(() => {

  // }, [job]);

  const getButtons = () => {
    switch (activeStep) {
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
    <Paper className={classes.root}>

      <Stepper nonLinear activeStep={activeStep} style={{ background: 'transparent' }} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={() => setActiveStep(index)}>
              {label}
            </StepButton>
            {/* <StepContent>
              {stepView}
            </StepContent> */}
          </Step>
        ))}
      </Stepper>
      <div>
        {getStepContent(activeStep)}
      </div>
    </Paper>
  );
};

export default EditProjectJob;
// import React from 'react';
// import { makeStyles } from '@material-ui/core/styles';
// import Stepper from '@material-ui/core/Stepper';
// import Step from '@material-ui/core/Step';
// import StepButton from '@material-ui/core/StepButton';
// import Button from '@material-ui/core/Button';
// import Typography from '@material-ui/core/Typography';

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//   },
//   button: {
//     marginRight: theme.spacing(1),
//   },
//   completed: {
//     display: 'inline-block',
//   },
//   instructions: {
//     marginTop: theme.spacing(1),
//     marginBottom: theme.spacing(1),
//   },
// }));

// function getSteps() {
//   return ['Select campaign settings', 'Create an ad group', 'Create an ad'];
// }

// function getStepContent(step) {
//   switch (step) {
//     case 0:
//       return 'Step 1: Select campaign settings...';
//     case 1:
//       return 'Step 2: What is an ad group anyways?';
//     case 2:
//       return 'Step 3: This is the bit I really care about!';
//     default:
//       return 'Unknown step';
//   }
// }

// export default function EditProjectJob() {
//   const classes = useStyles();
//   const [activeStep, setActiveStep] = React.useState(0);
//   const [completed, setCompleted] = React.useState({});
//   const steps = getSteps();

//   const totalSteps = () => {
//     return steps.length;
//   };

//   const completedSteps = () => {
//     return Object.keys(completed).length;
//   };

//   const isLastStep = () => {
//     return activeStep === totalSteps() - 1;
//   };

//   const allStepsCompleted = () => {
//     return completedSteps() === totalSteps();
//   };

//   const handleNext = () => {
//     const newActiveStep =
//       isLastStep() && !allStepsCompleted()
//         ? // It's the last step, but not all steps have been completed,
//         // find the first step that has been completed
//         steps.findIndex((step, i) => !(i in completed))
//         : activeStep + 1;
//     setActiveStep(newActiveStep);
//   };

//   const handleBack = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep - 1);
//   };

//   const handleStep = (step) => () => {
//     setActiveStep(step);
//   };

//   const handleComplete = () => {
//     const newCompleted = completed;
//     newCompleted[activeStep] = true;
//     setCompleted(newCompleted);
//     handleNext();
//   };

//   const handleReset = () => {
//     setActiveStep(0);
//     setCompleted({});
//   };

//   return (
//     <div className={classes.root}>
//       <Stepper nonLinear activeStep={activeStep}>
//         {steps.map((label, index) => (
//           <Step key={label}>
//             <StepButton onClick={handleStep(index)} completed={completed[index]}>
//               {label}
//             </StepButton>
//           </Step>
//         ))}
//       </Stepper>
//       <div>
//         {allStepsCompleted() ? (
//           <div>
//             <Typography className={classes.instructions}>
//               All steps completed - you&apos;re finished
//             </Typography>
//             <Button onClick={handleReset}>Reset</Button>
//           </div>
//         ) : (
//           <div>
//             <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
//             <div>
//               <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
//                 Back
//               </Button>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleNext}
//                 className={classes.button}
//               >
//                 Next
//               </Button>
//               {activeStep !== steps.length &&
//                 (completed[activeStep] ? (
//                   <Typography variant="caption" className={classes.completed}>
//                     Step {activeStep + 1} already completed
//                   </Typography>
//                 ) : (
//                   <Button variant="contained" color="primary" onClick={handleComplete}>
//                     {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
//                   </Button>
//                 ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }