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

const NavTree = (props) => {
  const teamReducer = useSelector((state) => state.team);
  const projectReducer = useSelector((state) => state.project);
  const {projectDictionary} = projectReducer;
  const {teamDictionary} = teamReducer;
  const history = useHistory();

  const {teamId, children: teamWithChild} = props;

  const classes = useStyles();

  const team = teamDictionary[teamId];

  const projectId = team?.parent?._id ? team.parent._id : team?.parent;
  const project = projectDictionary[projectId];
  const parent = team?.parent;

  if (project && project?._id) {
    const children = teamWithChild?.children;
    const {parentModelName} = team;
    return (
      <List component="div" disablePadding>
        <ListItem
          button
          className={classes.nested}
          onClick={() => {
            history.push('/projects/' + teamId);
          }}
        >
          <ListItemIcon>
            <SubdirectoryArrowRightRoundedIcon />
            <FolderOpenRoundedIcon />
          </ListItemIcon>
          {project.displayName}
        </ListItem>

        {children && children.length > 0 ?
          children.map((child, i) => {
            return (
              <ListItem button className={classes.nested} key={i}>
                <NavTree teamId={child.teamId}>{child.children}</NavTree>
              </ListItem>
            );
          }) :
          null}
      </List>
    );
  }
  else {
    return null;
  }
};

export default NavTree;
