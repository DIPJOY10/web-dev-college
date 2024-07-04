import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import RoleCreate from './role.create';
import RoleEdit from './role.edit';
import RoleList from './role.list';
import Api from '../../helpers/Api';
import {setRoleMaps} from './roleMap.utils';

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
  const classes = useStyles();
  const history = useHistory();
  const roleMapReducer = useSelector((state) => state.roleMap);
  const dispatch = useDispatch();
  const {
    roles, onRoleCreate, onRoleDelete,
  } = props;

  const [editRoleId, setEditRoleId] = useState(null);
  const [mode, setMode] = useState('List');
  let RoleView = null;
  const {
    root, row, col,
  } = classes;

  const _getByIds= ()=>{
    Api.post('roleMap/getByIds', {
      roles,
    }).then((res)=>{
      const roleMaps = res?.result?res?.result:[];
      setRoleMaps(roleMaps, roleMapReducer, dispatch);
    });
  };

  useEffect(() => {
    if (roles.length==0) {
      setMode('Create');
    }

    _getByIds();
  }, []);

  switch (mode) {
    case 'Create':
      RoleView = <RoleCreate onRoleCreate={onRoleCreate} setMode={setMode}/>;
      break;

    case 'Edit':
      RoleView = <RoleEdit setMode={setMode} roleId={editRoleId} />;
      break;

    case 'List':
      RoleView = <RoleList
        roles={roles}
        onRoleDelete={onRoleDelete}
        setEditRole={setEditRoleId}
        setMode={setMode}
      />;
      break;

    default:
      break;
  }

  return (
    <div className={col}>
      {RoleView}
    </div>
  );
}
