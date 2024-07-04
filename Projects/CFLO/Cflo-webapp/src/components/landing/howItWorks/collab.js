import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import TeamHome from '../../team/team.collab';
import {useSpring, animated} from 'react-spring';
import {useMeasure, useIntersection} from 'react-use';

const useStyles = makeStyles((theme) => ({

  mainText: {
    fontSize: '2.5rem',
    fontWeight: '700',
    textAlign: 'center',
    margin: '2rem',
    marginBottom: '1rem',
  },

}));

export default function TopicBox() {
  const classes = useStyles();

  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.75],
  });

  const ratio = intersection?.intersectionRatio;

  const [props, set, stop] = useSpring(()=>({
    scaleVal: 1,
    from: {scaleVal: 0.8},
    config: {
      duration: 500,
    },
  }));


  useEffect(() => {
    if (ratio<0.05) {
      set({
        scaleVal: 0.8,
      });
    }

    if (ratio>0.75) {
      set({
        scaleVal: 1,
      });
    }
  }, [ratio]);


  const AnimatedBox = animated(Box);


  return (
    <Box ref={intersectionRef} flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1} display="flex" overflow="hidden" width="100%" >

      <Typography className={classes.mainText}>
            Workspace
      </Typography>

      <AnimatedBox style={{transform: `scale(${props.scaleVal.value})`}} flexDirection="column" flexGrow={1} display="flex" maxWidth="60rem">
        <TeamHome />
      </AnimatedBox>

    </Box>
  );
}
