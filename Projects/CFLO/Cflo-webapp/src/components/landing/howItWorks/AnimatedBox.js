import React, {useEffect, useState} from 'react';
import {useTheme, makeStyles} from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import {useSpring, animated} from 'react-spring';
import {useIntersection} from 'react-use';
import {
  useMediaQuery,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({


  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1rem',

  },

  img: (props)=>props,

  imgSm: {
    margin: '1rem',
    width: '100%',

  },

  title: {

    fontWeight: '700',
    fontSize: '2.3rem',
    marginTop: '2rem',
    marginRight: '3rem',
    marginBottom: '1rem',
    maxWidth: '24rem',
    color: '#424242',
  },
  subText: {
    marginTop: '1rem',
    marginRight: '3rem',
    fontWeight: '500',
    fontSize: '1.5rem',
    maxWidth: '24rem',
    color: '#424242',
    marginBottom: 0,
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem',
    },
  },


}));

export default function TopicBox(props) {
  const {
    title,
    texts,
    image,
    imgStyle,
    reverse,
  } = props;

  const imgStyleUse = imgStyle?imgStyle:{
    margin: '3rem',
    height: '20rem',
  };

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const classes = useStyles(imgStyleUse);

  const intersectionRef = React.useRef(null);
  const intersection = useIntersection(intersectionRef, {
    root: null,
    rootMargin: '0px',
    threshold: [0, 0.75],
  });

  const ratio = intersection?.intersectionRatio;

  const [propLefts, setLeft, stopLeft] = useSpring(()=>({
    opacity: 1,
    marginLeft: 0,
    from: {opacity: 0, marginLeft: -200},
    config: {
      duration: 500,
    },
  }));

  const [propRights, setRight, stopRight] = useSpring(()=>({
    marginRight: 0,
    opacity: 1,
    from: {opacity: 0, marginRight: -200},
    config: {
      duration: 500,
    },
  }));

  useEffect(() => {
    if (ratio<0.05) {
      setLeft({
        opacity: 0, marginLeft: -200,
      });
      setRight({
        opacity: 0, marginRight: -200,
      });
    }

    if (ratio>0.75) {
      setLeft({
        opacity: 1, marginLeft: 0,
      });
      setRight({
        opacity: 1, marginRight: 0,
      });
    }
  }, [ratio]);

  const AnimatedBox = animated(Box);


  let UseBox = AnimatedBox;

  if (isSmall) {
    UseBox = Box;
  }

  const Box1 = <UseBox style={reverse?propRights:propLefts} flexDirection="column" flexGrow={1} display="flex" maxWidth="30rem" width={'95%'}>
    <div className={classes.col}>
      <img src={image} className={isSmall?classes.imgSm:classes.img} />
    </div>
  </UseBox>;

  const Box2 = <UseBox style={reverse?propLefts:propRights} flexDirection="column" flexGrow={1} display="flex" >
    <Box flexDirection="column" flexGrow={1} display="flex" maxWidth={'30rem'} width={'100%'} textAlign="center" alignItems="center" justifyContent="center">
      <Typography className={classes.title}>{title}</Typography>
      {texts.map((text)=>{
        return (
          <Typography className={classes.subText}>
            {text}
          </Typography>
        );
      })}

    </Box>
  </UseBox>;

  let Boxes = [Box1, Box2];

  if (reverse||isSmall) {
    Boxes = [Box2, Box1];
  }

  let boxProps = {};
  if (isSmall) {
    boxProps = {
      justifyContent: 'center',
      alignItems: 'center',
    };
  }

  return (
    <Box ref={intersectionRef} flexDirection="column" justifyContent="center" alignItems="center" flexGrow={1} display="flex" overflow="hidden" width="100%" >

      <Box flexDirection={isSmall?'column':'row'} flexGrow={1} display="flex" maxWidth="62rem" width={'100%'} paddingLeft={'1rem'} alignItems="center">
        {Boxes}
      </Box>


    </Box>
  );
}
