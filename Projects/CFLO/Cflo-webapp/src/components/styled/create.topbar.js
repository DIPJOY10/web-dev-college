import React, {useEffect, useRef, useState} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import {
  Toolbar,
} from '@material-ui/core';
import CreateBtn from './actionBtns/create.btn';
import DoneIcon from '@material-ui/icons/Done';
import {
  useHistory,
} from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  toolbar: {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '3rem',
    height: '5.5rem',
    position: 'fixed',
    top: 0,
    right: 0,
    left: '17rem',
    [theme.breakpoints.down('sm')]: {
      left: '5rem',
    },
    [theme.breakpoints.down('xs')]: {
      left: '1rem',
    },
  },

  link: {
    display: 'flex',
  },

  createBtn: {
    position: 'fixed',
    top: '1rem',
    right: '2rem',
  },

}));

function CreateTopBar(props) {
  const history = useHistory();
  const classes = useStyles();
  const {
    teamId, typeName, typeHomePath,
    showCreate, saveText, createApi,
  } = props;

  const {teamDictionary} = useSelector((state)=>state.team);
  const team = teamDictionary[teamId];
  const {parentModelName} = team;

  return (
    <Toolbar className={classes.toolbar}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" onClick={()=>{
          let path = '/';

          switch (parentModelName) {
            case 'Project':
              path = '/projects/'+teamId;
              break;

            case 'Organization':
              path = '/organizations/'+teamId;
              break;

            default:
              break;
          }

          history.push(path);
        }} className={classes.link}>
          <HomeIcon className={classes.icon} />
                         Home
        </Link>
        <Link
          color="inherit"
          onClick={()=>{
            history.push(typeHomePath);
          }}
          className={classes.link}
        >

          {typeName}
        </Link>

      </Breadcrumbs>

      {showCreate?<div className={classes.createBtn}>
        <CreateBtn endIcon={<DoneIcon />} onClick={()=>{
          createApi();
        }}

        >
          {saveText}
        </CreateBtn>
      </div>:null}
    </Toolbar>
  );
}

export default CreateTopBar;
