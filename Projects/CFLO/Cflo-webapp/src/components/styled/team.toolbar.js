import React, {useEffect, useRef, useState} from 'react';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import {useSelector, useDispatch} from 'react-redux';
import HomeIcon from '@material-ui/icons/Home';
import {
  Toolbar,
} from '@material-ui/core';
import {
  useHistory,
} from 'react-router-dom';
import PaperBtn from './actionBtns/paper.btn';

const useStyles = makeStyles((theme) => ({
  tabRoot: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginBottom: '1rem',
    padding: '1rem',
    height: '4rem',
    maxHeight: '4rem',
  },

}));

function CreateTopBar(props) {
  const history = useHistory();
  const classes = useStyles();
  const {
    teamId,
  } = props;

  const {teamDictionary} = useSelector((state)=>state.team);
  const team = teamDictionary[teamId];
  const {parentModelName} = team;

  return (
    <Toolbar variant="dense" className={classes.tabRoot} teamId={teamId}>
      <PaperBtn
        text={'Home '}
        icon={<HomeIcon />}
        onClick={()=>{
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
        }}
      />
      {props.children}
    </Toolbar>
  );
}

export default CreateTopBar;
