import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RentCompTable from './rent.comp.table';
import Typography from '@material-ui/core/Typography';
import NumberFormat from 'react-number-format';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import CreateBtn from '../styled/actionBtns/create.btn';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    padding: '2vh 0',
    margin: '3vh 0'
    // height:'100%'
    // border: '1px solid green',
    // alignItems: "center",
  },
  row: {
    flex: 1,
    display: 'flex',
    width: "100%",
    // border: '1px solid red',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
  },

  numInputRow: {
    // width: '17rem',
    // maxWidth: '17rem',
    width: '100%',
  },

  nameInputRow: {
    // maxWidth: '34rem',
    width: "100%",
    marginBottom: '1rem',
  },

  nameInputBox: {
    maxWidth: '17rem',
    // width: "100%",
    margin: '0.5rem',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      // border: '1px solid red'
    },
  },

  numInputBox: {
    width: '10rem',
    maxWidth: '10rem',
    margin: '0.5rem',
  },
}));
export default function RentComps(props) {
  const classes = useStyles();
  const { comps, setComps } = props;
  const [resetBool, setReset] = useState(false);

  const [comp, setComp] = useState({
    name: '',
    address: '',
    units: 1,
    unitRent: 100,
    rsf: 20,
  });

  const [isFilled, setIsFilled] = useState(false);

  const addComps = () => {
    setComps([...comps, comp]);
    setReset(true);
  };

  const reset = () => {
    setReset(true);
  };

  useEffect(() => {
    const isFilledNew = comp.name.length > 4 && comp.address.length > 4 && comp.units > 0;
    setIsFilled(isFilledNew);
    // console.log('is Filled is ',isFilledNew,comp)
    setComp(comp);
    if (resetBool) {
      setComp({
        name: '',
        address: '',
        units: 1,
        unitRent: 0,
        rsf: 0,
      });
      setReset(false);
    }
  }, [comp, resetBool]);

  // console.log(comp,' is the comp')

  return (
    <Paper className={classes.root} elevation={4}>
      <div className={classes.col}>
        {comps.length > 0 ? (
          <div className={classes.nameInputRow}>
            <RentCompTable comps={comps} setComps={setComps} />
          </div>
        ) : null}

        {resetBool ? null : (
          <>
            <div className={clsx(classes.row, classes.nameInputRow)}>
              <div className={clsx(classes.col, classes.nameInputBox)}>
                <Typography>Name</Typography>
                <TextField
                  id="standard-basic"
                  value={comp.hold}
                  placeholder={comp.name}
                  helperText={'Wall Street | Office Building'}
                  onChange={(event) => {
                    setComp({
                      ...comp,
                      name: event.target.value,
                    });
                  }}
                />
              </div>
              <div className={clsx(classes.col, classes.nameInputBox)}>
                <Typography>Address</Typography>
                <TextField
                  id="standard-basic"
                  value={comp.hold}
                  placeholder={comp.address}
                  helperText={'11 Wall St, New York, NY 10005, United States'}
                  onChange={(event) => {
                    setComp({
                      ...comp,
                      address: event.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className={clsx(classes.row, classes.nameInputRow)}>
              <div className={clsx(classes.col, classes.numInputBox)}>
                <Typography>Units</Typography>
                <TextField
                  id="standard-basic"
                  type="number"
                  value={comp.units}
                  helperText={'No. of units in project'}
                  placeholder={comp.irr}
                  onChange={(event) => {
                    const target = Number(event.target.value);
                    if (Number.isInteger(target) && target >= 0) {
                      setComp({
                        ...comp,
                        units: event.target.value,
                      });
                    }
                  }}
                />
              </div>
              <div className={clsx(classes.col, classes.numInputBox)}>
                <Typography>Average Unit Rent</Typography>
                <NumberFormat
                  value={comp.unitRent}
                  thousandSeparator={true}
                  prefix={'$'}
                  customInput={TextField}
                  onValueChange={(values) => {
                    const { value } = values;

                    if (value >= 0) {
                      setComp({
                        ...comp,
                        unitRent: value,
                      });
                    }
                  }}
                />
              </div>
              <div className={clsx(classes.col, classes.numInputBox)}>
                <Typography>Rent per sq ft</Typography>
                <NumberFormat
                  value={comp.rsf}
                  thousandSeparator={true}
                  prefix={'$'}
                  customInput={TextField}
                  onValueChange={(values) => {
                    const { value } = values;
                    if (value > 0) {
                      setComp({
                        ...comp,
                        rsf: value,
                      });
                    }
                  }}
                />
              </div>
            </div>
            <div className={classes.row}>
              <Button
                onClick={() => {
                  reset();
                }}
              >
                Reset
              </Button>
              {isFilled ? (
                <CreateBtn
                  onClick={() => {
                    addComps();
                  }}
                >
                  Add Comp
                </CreateBtn>
              ) : (
                <Button disabled={true} onClick={() => { }}>
                  Add Comp
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Paper>
  );
}
