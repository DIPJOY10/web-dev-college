import React, {useEffect, useRef, useState} from 'react';
import ProjectSetting from '../projects/project.setting';
import Tasks from '../task/tasks';
import Transactions from '../transaction/transactions';
import Issues from '../issue/issues';

export default function HandleTabView(props) {
  const {teamId, tabState, showTeamPanel} = props;
  let TabView = <></>;

  switch (tabState) {
    case 'Project':
      TabView = <ProjectSetting teamId={teamId} showTeamPanel={showTeamPanel}/>;
      break;


    case 'Tasks':
      TabView = <Tasks teamId={teamId} showTeamPanel={showTeamPanel}/>;
      break;

    case 'Payments':
      TabView = <Transactions teamId={teamId} showTeamPanel={showTeamPanel}/>;
      break;

    case 'Issues':
      TabView = <Issues teamId={teamId} showTeamPanel={showTeamPanel}/>;
      break;

    default:
      break;
  }

  return TabView;
}
