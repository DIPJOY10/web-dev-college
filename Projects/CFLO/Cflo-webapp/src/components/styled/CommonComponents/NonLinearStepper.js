import React from "react";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Stepper from "@material-ui/core/Stepper";
import PropTypes from 'prop-types';
import Step from "@material-ui/core/Step";
import StepButton from "@material-ui/core/StepButton";
import clsx from 'clsx';
import Tooltip from '@material-ui/core/Tooltip';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import StepLabel from '@material-ui/core/StepLabel';
import { useTheme } from "@material-ui/core/styles";
import { useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        width: "100%",
    },
    button: {
        marginRight: theme.spacing(1)
    },
    backButton: {
        marginRight: theme.spacing(1)
    },
    completed: {
        display: "inline-block"
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    mainLabel: {
        fontSize: "19px",
        color: "#808494",
        [theme.breakpoints.down('sm')]: {
            fontSize: "16px",
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: "14px",
        },
    },
    mainLabelActive: {
        fontSize: "19px",
        color: theme.palette.primary.main,
        [theme.breakpoints.down('sm')]: {
            fontSize: "16px",
        },
        [theme.breakpoints.down('xs')]: {
            fontSize: "14px",
        },
    },
    mainCont: {
        backgroundColor: "white",
        width: "220px",
        color: "black",
        "& h3": {
            fontSize: "16px",
            fontWeight: "510",
            textAlign: "center",
            padding: "7px 0px",
            color: "white"
        }
    },
    lineCont: {
        display: "flex",
        alignItems: "flex-start",
        marginBottom: "5px",
        "& span": {
            fontSize: "13px",
            fontWeight: "450",
        }
    },
    bodyCont: {
        width: "100%",
        padding: "7px"
    }
}));

const LightTooltip = withStyles((theme) => ({
    tooltip: {
        padding: "0px",
        margin: "0px",
        borderRadius: "5px",
        border: "1px solid #dadde9"
    }
}))(Tooltip);

const useQontoStepIconStyles = makeStyles((theme) => ({
    root: {
        color: '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
    },
    active: {
        color: theme.palette.primary.main,
    },
    circleActive: {
        width: "7px",
        height: "7px",
        border: `8px solid ${theme.palette.primary.main}`,
        borderRadius: '50%',
        backgroundColor: 'white',
        [theme.breakpoints.down('xs')]: {
            width: "6px",
            height: "6px",
            border: `5px solid ${theme.palette.primary.main}`,
        }
    },
    circle: {
        width: "7px",
        height: "7px",
        border: `8px solid #B5B5B5`,
        borderRadius: '50%',
        backgroundColor: 'white',
        [theme.breakpoints.down('xs')]: {
            width: "6px",
            height: "6px",
            border: `5px solid #B5B5B5`,
        }
    },
    completed: {
        color: theme.palette.primary.main,
        zIndex: 1,
        fontSize: "28px",
        [theme.breakpoints.down('xs')]: {
            fontSize: "20px",
        }
    },
    tooltipStyle: {
        width: "200px",
        height: "200px",
        color: "white",
        backgroundColor: "green",
        borderRadius: "10px"
    }
}));

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;

    return (
        <div
            className={clsx(classes.root, { [classes.active]: active })}
        >
            {completed ? (<>
                <CheckCircleIcon className={classes.completed} />
            </>) : (<>
                <div className={active ? classes.circleActive : classes.circle} />
            </>)}
        </div>
    );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};


export default function NonLinearStepper({ status, totalSteps, steps, stepContent, activeStep, setActiveStep, completed, setCompleted }) {
    const classes = useStyles();
    const theme = useTheme()
    const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    function isStepComplete(step) {
        return completed.has(step);
    }

    return (
        <div className={classes.root}>
            <Stepper alternativeLabel nonLinear activeStep={activeStep} style={{ padding: "24px 10px" }} >
                {steps.map((label, index) => {
                    return (
                        <Step key={label} >
                            <LightTooltip
                                title={
                                    <div className={classes.mainCont} >
                                        <h3 style={status?.[label]?.allover ? { backgroundColor: theme.palette.primary.success } : { backgroundColor: theme.palette.primary.fail }}  >{label}</h3>
                                        <div className={classes.bodyCont} >
                                            {status && status?.[label] ? (<>
                                                {status && status?.[label] && status?.[label]?.inputStatusArr && status?.[label]?.inputStatusArr.map((inputStatus) => (
                                                    <div className={classes.lineCont} >
                                                        {inputStatus?.status ? (
                                                            <CheckCircleIcon style={{ color: "green", fontSize: "15px" }} />
                                                        ) : (
                                                            <CancelIcon style={{ color: "red", fontSize: "15px" }} />
                                                        )}
                                                        <span style={{ marginLeft: "10px" }} >{inputStatus?.input}</span>
                                                    </div>
                                                ))}
                                            </>) : (<>
                                                <p>StepIconComponent</p>
                                                <p>StepIconComponent</p>
                                                <p>StepIconComponent</p>
                                                <p>StepIconComponent</p>
                                            </>)}
                                        </div>
                                    </div>
                                }
                            >
                                <StepButton
                                    onClick={handleStep(index)}
                                    completed={isStepComplete(index)}
                                >
                                    <StepLabel StepIconComponent={QontoStepIcon}>
                                        {isSmall ? (
                                            <p className={activeStep === index ? classes.mainLabelActive : classes.mainLabel} >{activeStep === index && label}</p>
                                        ) : (<div>
                                            <h3 className={activeStep === index ? classes.mainLabelActive : classes.mainLabel} >{label}</h3>
                                            <p style={{ color: "#808494", fontSize: "14px" }} >{activeStep === index && stepContent[index]}</p>
                                        </div>)}
                                    </StepLabel>
                                </StepButton>
                            </LightTooltip>
                        </Step>
                    );
                })}
            </Stepper>
        </div>
    );
}
