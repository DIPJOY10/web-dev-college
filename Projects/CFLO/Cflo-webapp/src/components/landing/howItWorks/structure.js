import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Structure from '../../../Assets/structure.svg';
import AnimatedBox from './AnimatedBox';


export default function HowItWorks() {
  return (

    <AnimatedBox
      title={'Project Structure'}
      texts={[
        'Real estate projects can quickly become complex. To handle this complexity divide your project into small teams',
        'Parent team members have access to all child teams  and their workspaces',
      ]}
      image={Structure}
      imgStyle={{
        margin: '1rem',
        height: '32rem',
      }}
    />
  );
}
