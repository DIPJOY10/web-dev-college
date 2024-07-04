import React, {useRef, useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import GoogleLogin from '../../auth/GoogleLogin';
import Toolbar from '@material-ui/core/Toolbar';
import TeamHome from '../../team/team.collab';
import {Divider} from '@material-ui/core';
import Job from './job';
import Invest from './invest';
import Structure from './structure';
import Collab from './collab';
import {useMeasure, useScroll} from 'react-use';

const useStyles = makeStyles((theme) => ({
  root: {
    flex: 1,
    flexDirection: 'row',
    top: 0,
    height: '4rem',
    backgroundColor: 'red',
  },

  textBlock: {
    flex: 6,
    flexDirection: 'column',
    marginTop: '5%',
    marginLeft: '10%',
    height: '30rem',
    padding: '1rem',
  },

  toolbar: {
    marginLeft: '4rem',
    marginTop: '2rem',
  },

  textHeader: {
    fontSize: '3.2rem',
    color: theme.palette.primary.main,
  },

  textSub: {
    marginTop: '1rem',
    fontSize: '1.6rem',
    color: '#616161',
  },

  imageBlock: {
    flex: 9,
  },
  workspace: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    margin: '2rem',
    marginBottom: '1rem',
  },


}));

export default function HowItWorks(props) {
  const classes = useStyles();
  const {
    pos, setPos,
  } = props;

  const [jobRef, {x, y, width, height, top, right, bottom, left}] = useMeasure();
  // console.log(x, y, width, height, top, right, bottom, left,' inJobs')

  const jobTopRef = useRef(null);
  const investTopRef = useRef(null);
  const collabTopRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setPos({
        job: jobTopRef,
        invest: investTopRef,
        collab: collabTopRef,
      });
    }, 2000);
  }, [jobTopRef, investTopRef, collabTopRef]);


  return (
    <Box flexDirection="column" flexGrow={1} display="flex" overflow="hidden" width="100%" >


      <Job
        pos={pos} setPos={setPos} />
      <div ref={jobTopRef} ></div>


      <Invest pos={pos} setPos={setPos} />
      <div ref={investTopRef}></div>
      <Structure pos={pos} setPos={setPos} />


      <Collab pos={pos} setPos={setPos} />
      <div ref={collabTopRef} ></div>

    </Box>
  );
}
