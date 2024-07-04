import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import SendIcon from '@material-ui/icons/Send';
import Paper from '@material-ui/core/Paper';
import {useHistory} from 'react-router-dom';
import {useSelector, useDispatch} from 'react-redux';
import FolderSharedIcon from '@material-ui/icons/FolderShared';
import MenuRoundedIcon from '@material-ui/icons/MenuRounded';
import IconButton from '@material-ui/core/IconButton';
import Avatar from '@material-ui/core/Avatar';
import FolderOpenRoundedIcon from '@material-ui/icons/FolderOpenRounded';
import SubdirectoryArrowRightRoundedIcon from '@material-ui/icons/SubdirectoryArrowRightRounded';
import ButtonBase from '@material-ui/core/ButtonBase';
import NavTree from './NavTree';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  icon: {
    backgroundColor: theme.palette.primary.main,
    marginRight: '1rem',
    marginLeft: '1rem',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    padding: '0.6rem',
  },
}));

export default function TeamNavigation(props) {
  const classes = useStyles();
  const {teamIds, teamMap, type, open, setOpen} = props;
  const teamReducer = useSelector((state) => state.team);
  const {teamDictionary, sortedProjectMap} = teamReducer;

  const history = useHistory();

  return (
    <List
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ButtonBase
          onClick={() => {
            setOpen(!open);
          }}
        >
          <ListSubheader className={classes.row} component="div" id="nested-list-subheader">
            <Avatar className={classes.icon}>
              <MenuRoundedIcon />
            </Avatar>

            <ListItemText primary={'Navigation'} />
          </ListSubheader>
        </ButtonBase>
      }
      className={classes.root}
    >
      {open ? (
        <>
          {teamIds.map((teamId) => (
            <NavTree teamId={teamId} key={teamId}>
              {teamMap[teamId]}{' '}
            </NavTree>
          ))}
        </>
      ) : null}
    </List>
  );
}
