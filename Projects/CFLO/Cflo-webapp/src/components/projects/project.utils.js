import Api from '../../helpers/Api';
import teamUtils from '../team/team.utils';

const {handleTeams} = teamUtils;

export const updateProject = (projectObject, state, dispatch, callback) => {
  if (projectObject && projectObject?._id) {
    const {project: projectReducer} = state;
    const {projectDictionary} = projectReducer;

    Api.post('project/update', projectObject).then((project) => {});

    const projectId = projectObject._id;
    const project = projectDictionary[projectId];
    const projectObject = {};
    projectObject[projectId] = {
      ...project,
      ...projectObject,
    };

    dispatch({
      type: 'AddProject',
      payload: {
        projectDictionary: {
          ...projectDictionary,
          ...projectObject,
        },
      },
    });
  }
};

export const setProjects = (projects, project, dispatch) => {
  const {projectDictionary} = project;

  if (projects && projects.length > 0) {
    const newProjectDictionary = {};

    projects.map((project) => {
      const projectId = project._id;
      newProjectDictionary[projectId] = project;
    });

    dispatch({
      type: 'AddProject',
      payload: {
        projectDictionary: {
          ...projectDictionary,
          ...newProjectDictionary,
        },
      },
    });
  }
};
