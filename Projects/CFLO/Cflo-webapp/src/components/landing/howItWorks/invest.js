import React, {useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import InvestGraph from '../../../Assets/invest_graph.svg';
import AnimatedBox from './AnimatedBox';
import {useMeasure, useScroll} from 'react-use';

export default function Invest(props) {
  const [ref, {x, y, width, height, top, right, bottom, left}] = useMeasure();

  const {
    pos, setPos,
  } = props;

  useEffect(() => {
    const loc = (top+bottom)/2;
    setPos({
      ...pos,
      invest: loc,
    });
  }, [top, bottom]);


  return (

    <AnimatedBox
      ref={ref}
      title={'Investors'}
      texts={[
        'Moniter financial health and progress of all your portfolio projects ',
        'Collect money from investors for scheduled contractor payments',
        'Distribute money collected from property managers to investors',

      ]}
      image={InvestGraph}
      reverse={true}

    />
  );
}
