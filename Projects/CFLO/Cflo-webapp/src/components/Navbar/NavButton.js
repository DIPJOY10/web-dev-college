import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { useMediaQuery, ButtonBase, Box } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderRadius: '3%',
    boxShadow: 'none',
    borderWidth: '1px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      marginLeft: 0,
      marginBottom: 0,
    },
  },

  fabStyle: {
    height: '1rem',
    width: '1rem',
  },
  iconStyles: {
    color: theme.palette.action.disabled,
    margin: 0,
  },
  iconStylesSelected: {
    color: theme.palette.primary.main,
    margin: 0,
  },
  gridStyle: {
    // display:'flex',
    borderWidth: 0,
    borderColor: 'grey',
  },
  textStyle: {
    fontSize: '14px',
    marginTop: '3px',
    color: theme.palette.action.disabled,
    fontWeight: '600',
    alignSelf: 'flex-start',
  },
  selected: {
    color: theme.palette.primary.main,
  },
  imgStyle: {
    marginLeft: '2rem',
  },
}));

export default function Navbottons(props) {
  const classes = useStyles();
  const location = useLocation();
  const pathname = location['pathname'];
  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const isMobile = useMediaQuery(theme.breakpoints.down('xs'));
  const Icon = props.icon;
  const index = props.index;
  const link = props.link;
  const text = props.text;
  const selected = pathname.slice(0, 5) === link.toLowerCase().slice(0, 5) ? true : false;

  const iconClass = selected ? classes.iconStylesSelected : classes.iconStyles;
  return (
    <Box
      marginBottom={isMobile ? '0rem' : '1rem'}
      marginTop={isMobile ? '0rem' : '0'}
      display={'flex'}
      flexDirection={'row'}
      justifyContent="center"
      width={isMobile ? '20%' : '100%'}
      maxWidth={'100%'}
    >
      <ButtonBase
        classes={{
          root: classes.buttonStyle,
        }}
        className={classes.buttonStyle}
        onClick={() => {
          history.push(link);
        }}
      >
        <Box
          display={'flex'}
          flexDirection={'column'}
          alignItems={"center"}
          justifyContent={'center'}
          width={'100%'}
        >
          <Icon fontSize="large" className={iconClass} />
          {isMobile ? null : (
            <Typography className={clsx(classes.textStyle, selected && classes.selected)} style={{ width: "100%" }} >{text}</Typography>
          )}
        </Box>
      </ButtonBase>
    </Box>
  );
}
