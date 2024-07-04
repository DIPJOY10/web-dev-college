import React, {useEffect, useState} from 'react';
import Jobs from '../../../Assets/jobs.svg';
import AnimatedBox from './AnimatedBox';
import {useMeasure, useScroll} from 'react-use';

export default function Job(props) {
  return (

    <AnimatedBox
      {...props}
      title={'Jobs'}
      texts={[
        'Project Managers can hire and manage real estate professionals',
        'Create your own pipelines to manage applications',
      ]}
      image={Jobs}
      imgStyle={{
        margin: '3rem',
        height: '17rem',
      }}
    />

  );
}
