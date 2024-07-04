import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Menubar from '../styled/menubar';
import ProjectRentalManage from '../ProjectAnalysis/project.rental.manage';

const useStyles = makeStyles((theme) => ({
  root: {

  },

  row: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },

  col: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
}));
export default function S(props) {
  const [nav, setNav] = useState('ProjectInfo');

  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {

  } = useSelector((state) => state);

  const {
    root, row, col,
  } = classes;

  let View = null;
  switch (nav) {
    case 'Tenants':
      View = <ProjectRentalManage />;
      break;

    case 'ProjectInfo':
      View = 'ProjectInfo';
      break;

    case 'ProjectAnalysis':
      View = 'ProjectAnalysis';
      break;

    default:
      break;
  }

  return (
    <div className={root}>
      <Menubar
        navState={nav}
        setNav={setNav}
        items={[
          {
            Icon: null,
            text: 'Project Info',
            navText: 'ProjectInfo',
          },
          {
            Icon: null,
            text: 'Tenants',
            navText: 'Tenants',
          },

          {
            Icon: null,
            text: 'Project Analysis',
            navText: 'ProjectAnalysis',
          },
        ]}
      />
      {View}
    </div>
  );
}
