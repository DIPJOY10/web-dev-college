import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useLocation} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import RemoveIcon from '@material-ui/icons/Remove';
import {useJob} from './job.hook';

const useStyles = makeStyles((theme) => ({

  rowDiv: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    marginTop: '0.25rem',
    marginBottom: '0.25rem',
  },

  typeChip: {
    height: '1.2rem',
    padding: 0,
    marginLeft: '0.3rem',
    backgroundColor: theme.palette.primary.light,
    color: 'white',
  },

  valChip: {

    height: '1.2rem',
    padding: 0,
    marginLeft: '0.3rem',
  },

  dashStyle: {
    marginTop: '3px',
    fontSize: 17,
  },

}));

export default function JobCard(props) {
  const classes = useStyles();
  const {jobId, setJobId} = props;
  const {job, isFeed} = useJob(jobId);
  let val1 = null;
  let val2 = null;
  let moneyView = null;
  if (job?.payType) {
    switch (job.payType) {
      case 'Fixed':
        val1 = job.fixed;
        val2 = null;
        moneyView = (

          <Chip
            label={'\u0024 '+val1}
            className={classes.valChip}
          />

        );
        break;

      case 'Negotiable':
        val1 = job.negoMin;
        val2 = job.negoMax;
        moneyView = (
          <>
            <Chip
              label={'min \u0024'+val1}
              className={classes.valChip}
            />

            <Chip
              label={'max \u0024'+val2}
              className={classes.valChip}
            />
          </>
        );
        break;


      case 'Performance based':
        val1 = job.minAssured;
        val2 = job.incentive;
        moneyView = (
          <>

            <Chip
              label={'Basic \u0024'+val1}
              className={classes.valChip}
            />

            <Chip
              label={'Incentive \u0024'+val2}
              className={classes.valChip}
            />
          </>
        );
        break;

      case 'Hourly':
        val1 = job.hourly;
        val2 = null;
        moneyView = (
          <>
            <Chip
              label={'\u0024 '+val1}
              className={classes.valChip}
            />
          </>
        );
        break;

      default:
        break;
    }

    return (
      <div className={classes.rowDiv}>
        <Chip
          label={job.payType}
          className={classes.typeChip}
        />
        {moneyView}
      </div>
    );
  }
  else {
    return null;
  }
}

