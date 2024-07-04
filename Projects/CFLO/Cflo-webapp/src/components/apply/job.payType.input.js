import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '32rem',
    justifyContent: 'center',
    // alignItems: 'center',
    // border: '1px solid red',
    margin: '4vh 0',
  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    margin: '1rem',
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
    flexDirection: 'column',
    display: 'flex',
    maxWidth: '32rem',
  },

  boxWidth: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '9rem',
    margin: '0.5rem',
  },
}));

export default function S(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const explore = useSelector((state) => state.explore);

  const {
    jobDictionary,
  } = explore;

  const {
    jobId, getPayType,
  } = props;


  const {
    root, row, col,
  } = classes;

  const job = jobDictionary[jobId];


  const [fixed, setFixed] = useState(job?.fixed);
  const [negoMin, setNegoMin] = useState(job?.negoMin);
  const [negoMax, setNegoMax] = useState(job?.negoMax);
  const [minAssured, setMinAssured] = useState(job?.minAssured);
  const [incentive, setIncentive] = useState(job?.incentive);
  const [hourly, setHourly] = useState(job?.hourly);

  useEffect(() => {
    getPayType({
      fixed, negoMin, negoMax, minAssured, incentive, hourly,
    });
  }, [fixed, negoMin, negoMax, minAssured, incentive, hourly]);

  const getPayForm = (payType) => {
    switch (payType) {
      case 'Fixed':
        return (
          <div className={classes.boxWidth}>
            <Typography variant="button">
              <b>Fixed</b>
            </Typography>
            <NumberFormat value={fixed} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
              const { value } = values;
              setFixed(value);
            }} />
          </div>
        );
        break;

      case 'Negotiable':
        return (
          <div className={classes.row}>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Minimum</b>
              </Typography>
              <NumberFormat value={negoMin} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
                setNegoMin(value);
              }} />
            </div>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Maximum</b>
              </Typography>
              <NumberFormat value={negoMax} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
                setNegoMax(value);
              }} />
            </div>
          </div>
        );
        break;

      case 'Performance based':
        return (
          <div className={classes.row}>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Assured</b>
              </Typography>
              <NumberFormat value={minAssured} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
                setMinAssured(value);
              }} />
            </div>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Incentive</b>
              </Typography>
              <NumberFormat value={incentive} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
                setIncentive(value);
              }} />
            </div>
          </div>
        );
        break;

      case 'Hourly':
        return (
          <div className={classes.row}>
            <div className={classes.boxWidth}>
              <Typography variant="button">
                <b>Hourly</b>
              </Typography>
              <NumberFormat value={hourly} thousandSeparator={true} prefix={'$'} customInput={TextField} onValueChange={(values) => {
                const { value } = values;
                setHourly(value);
              }} />
            </div>

          </div>
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className={root}>
      <Typography variant="h6">
        {job?.payType}<b> ( Your Quote )</b>
      </Typography>
      {getPayForm(job?.payType)}

    </div>
  );
}
