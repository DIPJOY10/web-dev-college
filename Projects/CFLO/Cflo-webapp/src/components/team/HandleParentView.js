import React, {useEffect, useRef, useState} from 'react';
import ProjectTeamCard from './project.team';
import BranchesTeamCard from './branches.team';
import BranchTeamCard from './branch.team';
import FoldersTeamCard from './folders.team';
import FolderTeamCard from './folder.team';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
});


export default function HandleParentView(props) {
  const classes = useStyles();
  const {parent, model, setTab, tab} = props;

  let Parent = <></>;


  switch (model) {
    case 'Project':
      Parent = <div className={classes.root}>
        <ProjectTeamCard project={parent} setTab={setTab} tab={tab} />
        <BranchesTeamCard project={parent} setTab={setTab} tab={tab} />
      </div>;

      break;


    case 'Branch':
      Parent = <div className={classes.root}>
        <BranchTeamCard branch={parent} setTab={setTab} tab={tab} />
        <FoldersTeamCard branch={parent} setTab={setTab} tab={tab} />
      </div>;

      break;

    case 'Folder':
      Parent = <div className={classes.root}>
        <FolderTeamCard folder={parent} setTab={setTab} tab={tab} />
      </div>;

      break;

    default:
      break;
  }

  return Parent;
}
