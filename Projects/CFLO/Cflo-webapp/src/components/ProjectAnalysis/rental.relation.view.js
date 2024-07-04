import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import {useHistory, useParams} from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import cx from 'clsx';
import Api from '../../helpers/Api';

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

  nameText: {
    marginLeft: '1rem',
    fontWeight: '600',
  },

  avatarStyle: {
    height: '2rem',
    width: '2rem',
  },

}));

export default function RentalRelationView(props) {
  const {
    tenantRelationId,
  } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const {
    project: projectReducer,
  } = useSelector((state) => state);

  const {
    tenantRelationDictionary={},
  } = projectReducer;

  const {
    root, row, col, avatarStyle,
    nameText,
  } = classes;

  const tenantRelationOld = tenantRelationDictionary[tenantRelationId];

  const [tenantRelation, setTenantRelation] = useState(tenantRelationOld);

  const {
    team,
    tenant,
    unit,
  } = tenantRelation||{};

  const project = team?.parent;

  const getRelDetail = async ()=>{
    const res = await Api.post('');
  };


  return (
    <div className={root}>
      <div className={row}>
        <Avatar src={tenant} className={avatarStyle} />
        <Typography className={nameText}>{tenant?.displayName}</Typography>
      </div>


      <div className={row}>
        <div className={row}>
          <Typography>{project?.displayName}</Typography>
          <div className={row}>
          </div>
          <Typography><b>{unit?.name}</b></Typography>
        </div>
      </div>
    </div>
  );
}
