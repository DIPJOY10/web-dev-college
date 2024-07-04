import React, {useRef, useState, useCallback} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import {AppBar, Divider, Toolbar, IconButton, Typography, useScrollTrigger, useMediaQuery} from '@material-ui/core';
import {Fab} from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ButtonBase from '@material-ui/core/ButtonBase';
import cx from 'clsx';

const drawerWidth = '17rem';
const foldedWidth = '8rem';

const toolStyles = makeStyles((theme) => ({
  toolbar: {
    display: 'flex',
    flexDirection: 'row',
    height: '1rem',
    width: '100%',
    backgroundColor: 'white',
    marginTop: '-0.8rem',
  },

  iconDiv: {
    display: 'flex',
    height: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: (props) => {
      const width = 100 / props.length;
      return `calc(${width}%)`;
    },
    [theme.breakpoints.down('sm')]: {
      width: (props) => {
        const width = 100 / props.length;

        return `calc(${width}%)`;
      },
    },
    [theme.breakpoints.down('xs')]: {
      width: (props) => {
        const width = 100 / props.length;
        return `calc(${width}%)`;
      },
    },
  },

  iconDivSelected: {
    display: 'flex',
    height: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    width: (props) => {
      const width = 100 / props.length;
      return `calc(${width}%)`;
    },
    [theme.breakpoints.down('sm')]: {
      width: (props) => {
        const width = 100 / props.length;
        const shift = 5 / 3;
        return `calc(${width}%)`;
      },
    },
    [theme.breakpoints.down('xs')]: {
      width: (props) => {
        const width = 100 / props.length;
        return `calc(${width}%)`;
      },
    },
  },

  iconCard: {
    display: 'flex',
    padding: '0.4rem',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#424242',
    width: '100%',
  },

  iconCardSelected: {
    display: 'flex',
    padding: '0.4rem',
    alignSelf: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.palette.primary.main,
    width: '100%',
  },

  gridTopTextStyle: {
    textAlign: 'center',
    fontWeight: '700',
  },

  textSelected: {
    color: theme.palette.primary.main,
  },
}));

export default function Menubar(props) {
  const {items, navState} = props;

  const length = items?.length ? items.length : 1;
  const classes = toolStyles({length});
  // console.log(classes.iconDivSelected)

  const IconCard = (Icon, text, onClick) => {
    const {iconCard, iconCardSelected, iconDiv, iconDivSelected, textSelected, gridTopTextStyle} = classes;
    const isSelected = text == navState;
    const style = isSelected ? iconCardSelected : iconCard;
    const divStyle = isSelected ? iconDivSelected : iconDiv;
    console.log(text, navState, isSelected);

    return (
      <div className={divStyle}>
        <ButtonBase
          key={text}
          className={style}
          onClick={() => {
            onClick();
          }}
        >
          <Typography className={cx(gridTopTextStyle, isSelected && textSelected)}>{text}</Typography>
        </ButtonBase>
      </div>
    );
  };

  return (
    <Toolbar className={classes.toolbar}>
      {items.map((item) => {
        const {Icon, text, onClick} = item;
        return IconCard(Icon, text, onClick);
      })}
    </Toolbar>
  );
}
